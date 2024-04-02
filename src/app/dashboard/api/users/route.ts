import prisma from "@/configs/database";
import { hasIncompleteFields, nAccesses } from "@/utils";
import { UserRoles } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  interface ReqBody { personId: string, username: string, password: string, roles: UserRoles; }

  const reqBody = await request.json() as ReqBody;
  const { personId, username, password, roles } = reqBody;

  if (hasIncompleteFields({ personId, username, password, roles })) {
    return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
  }

  const user = await prisma.user.create({
    data: {
      personId: personId,
      isSuperAdmin: false,
      username: username,
      password: password,
      roles: roles
    }
  });

  return NextResponse.json({ code: "OK", message: "User created successfully", data: user });
}


export async function GET(request: NextRequest) {
  request.headers.has("Authorization");
  try {
    const data = await getUsers(request);

    return NextResponse.json({ code: "OK", message: "Users fetched successfully", data: data });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
    
  }  
}


export async function getUsers(request: NextRequest) {
  request.headers.has("Authorization");
  try {

    const defaultElements = 15;

    const pagination = request.nextUrl.searchParams.get("pagination");

    interface Pagination {
        page?: number | undefined;
        elements?: number | undefined;
    }
    
    const { page, elements }: Pagination = pagination ? JSON.parse(decodeURI(pagination)) : {};
    

    interface userList {
      id: string;
      username: string;
      active: boolean;
      activemodules?: number;
      roles: {
        visor: string | null;
        whats: string | null;
      };
      Person: {
        name: string;
        fatherLastName: string;
        motherLastName: string | null;
        email: string | null;
      };
    }[];

    const data: userList[] = await prisma.user.findMany({
      skip: ( page ? page - 1 : 0 ) * (elements || defaultElements),
      take: elements || defaultElements,
      select: {
        id: true,
        roles: true,
        active: true,
        username: true,
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

    data.forEach(element => {
      element.activemodules = nAccesses(element.roles);
    });

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
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



