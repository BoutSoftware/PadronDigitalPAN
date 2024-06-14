import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { nAccesses, parseUserRoles } from ".";
import { UserRoles } from "@/configs/roles";

export async function POST(request: NextRequest) {
  interface ReqBody { personId: string, username: string, password: string, roles: UserRoles; }

  const reqBody = await request.json() as ReqBody;
  const { personId, username, password, roles } = reqBody;

  // Check if some fields are missing
  if (hasIncompleteFields({ personId, username, password, roles })) {
    return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
  }

  // Check if theres a user with the same username
  const userExists = await prisma.user.findUnique({ where: { username: username } });
  if (userExists) {
    return NextResponse.json({ code: "USER_EXISTS", message: "A user with the same username already exists" });
  }

  // Check if person already has a user
  const personHasUser = await prisma.user.findFirst({ where: { personId: personId } });
  if (personHasUser) {
    return NextResponse.json({ code: "PERSON_HAS_USER", message: "The person already has a user" });
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      personId: personId,
      username: username,
      password: hashedPassword,
      roles: Object.keys(roles).map((key) => ({ module: key, role: roles[key as keyof UserRoles] })),
    }
  });

  return NextResponse.json({ code: "OK", message: "User created successfully", data: user });
}


export async function GET(request: NextRequest) {
  request.headers.has("Authorization");

  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "") || undefined;
    const elements = parseInt(request.nextUrl.searchParams.get("elements") || "") || undefined;

    const data = await getUsers(page, elements);

    return NextResponse.json({ code: "OK", message: "Users fetched successfully", data: data });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}


async function getUsers(page: number | undefined, elements: number | undefined) {
  const data = await prisma.user.findMany({
    where: {
      active: true,
    },
    skip: page && elements ? (page - 1) * elements : undefined,
    take: elements,
    select: {
      id: true,
      roles: true,
      active: true,
      username: true,
      isSuperAdmin: true,
      Person: {
        select: {
          name: true,
          fatherLastName: true,
          motherLastName: true,
          email: true,
        },
      },
    },
  });

  const users = data.map(user => ({
    ...user,
    activeModules: nAccesses(user.roles),
    roles: parseUserRoles(user.roles, user.active),
  }));

  return users;
}


// TODO: Remove or fix these comments
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function getUsersDBRules() {
//   const users = await prisma.user.findMany({
//     include: {
//       Person: true,
//       Roles: {
//         include: {
//           Module: true
//         }
//       }
//     }
//   });

//   const modules = await prisma.module.findMany();

//   const data = users.map((user) => {
//     const userRoles = {} as { [key: string]: string; };

//     user.Roles.forEach((role) => {
//       userRoles[role.Module.key] = role.name;
//     });

//     if (user.isSuperAdmin) {
//       userRoles["sup"] = "SuperAdmin";

//       modules.forEach((module) => {
//         userRoles[module.key] = "SuperAdmin";
//       });
//     }

//     // const userRoles = user.Roles.reduce((acc, role) => {
//     //   acc[role.Module.key] = role.name;
//     //   return acc;
//     // }, {} as { [key: string]: string });
//     return {
//       id: user.id,
//       isSuperAdmin: user.isSuperAdmin,
//       username: user.username,
//       name: user.Person.name,
//       roles: userRoles
//     };
//   });

//   return data;
// }

// // Get users via "modules" field
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function getUsersBothStatic() {
//   const users = await prisma.user.findMany({
//     include: {
//       Person: true,
//     }
//   });

//   return users.map((user) => {
//     return {
//       id: user.id,
//       isSuperAdmin: user.isSuperAdmin,
//       username: user.username,
//       name: user.Person.name,
//       roles: user.modules
//     };
//   });
// }

// // Get users via "userRoles" field
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function getUsersCatalogRules() {
//   const users = await prisma.user.findMany({
//     include: {
//       Person: true,
//     }
//   });

//   return users.map((user) => {
//     // const roles = {} as { [key: string]: string; };

//     // user.userRoles.forEach((role) => {
//     //   roles[role.moduleName] = role.roleName;
//     // });

//     const userRoles = user.userRoles.reduce((acc, role) => {
//       acc[role.moduleName] = role.roleName;
//       return acc;
//     }, {} as { [key: string]: string });

//     return {
//       id: user.id,
//       isSuperAdmin: user.isSuperAdmin,
//       username: user.username,
//       name: user.Person.name,
//       roles: userRoles
//     };
//   });
// }

// async function getUsers() {
//   const users = await prisma.user.findMany({
//     include: {
//       Person: true,
//     }
//   });

//   return users.map((user) => {
//     if (user.isSuperAdmin) {
//       Object.keys(user.roles).forEach((role) => {
//         user.roles[role as keyof UserRoles] = "Admin";
//       });
//     }

//     return {
//       id: user.id,
//       isSuperAdmin: user.isSuperAdmin,
//       username: user.username,
//       name: user.Person.name,
//       roles: user.roles
//     };
//   });
// }



