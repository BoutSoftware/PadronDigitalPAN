"use client";
import Header from "@/components/Header";
import ModalAddUser from "@/components/ModalAddUser";
import { Input, Table, TableBody, TableCell, TableRow, TableColumn, TableHeader, Button, Chip, User } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";

// TODO: Paginación (¿Cuántos elementos por página?)

interface Person {
  name: string;
  fatherLastName: string;
  motherLastName: string;
  email: string;
}

interface User {
  id: string;
  active: boolean;
  username: string;
  isSuperAdmin: boolean;
  Person: Person;
  activeModules: number;
}

const columns = [
  { name: "Nombre", id: "name" },
  { name: "Módulos activos", id: "activeModules" },
  { name: "Estatus", id: "status" },
  { name: "Acciones", id: "actions" }
];

const renderCell = (columnKey: React.Key, user: User) => {
  if (columnKey == "name") return (
    <User
      className="gap-3"
      name={
        <div className="flex items-center gap-2">
          {user.Person.name}
          {user.isSuperAdmin && (
            <span className="material-symbols-outlined icon-filled text-warning-500 icon-sm">star</span>
          )}
        </div>
      }
      description={user.username}
    />
  );
  if (columnKey == "activeModules") return user.activeModules.toString();
  if (columnKey == "status") return (
    <Chip variant="solid" color={user.active ? "success" : "danger"}>{user.active ? "Activo" : "Inactivo"}</Chip>
  );
  if (columnKey == "actions") return (
    <div className="flex gap-1">
      <Button as={Link} href={`/dashboard/base/users/${user.id}`} size="sm" variant="light" color="default" isIconOnly>{<span className="material-symbols-outlined icon-sm">edit</span>}</Button>
      <Button size="sm" variant="flat" color="danger" isIconOnly>{<span className="material-symbols-outlined icon-sm">delete</span>}</Button>
    </div>
  );
};

export default function AllUsersPage() {

  const [userSearched, setUserSearched] = useState("");
  const [usersFiltered, setUsersFiltered] = useState<User[]>();
  const [users, setUsers] = useState<User[]>();

  async function getUsers() {
    const res = await fetch("/dashboard/api/users", { method: "GET" });
    const resData = await res.json();
    await setUsers(resData.data);
    await setUsersFiltered(resData.data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (users) {
      const userUpperCase = userSearched.toUpperCase();
      const currentUsersFiltered = users.filter(item => item.Person.name.toUpperCase().includes(userUpperCase));
      if (currentUsersFiltered.length > 0 && userSearched.length > 0) setUsersFiltered(currentUsersFiltered);
      if (currentUsersFiltered.length > 0 && userSearched.length == 0) setUsersFiltered(users);
    }
  }, [userSearched, users]);

  return (
    <div className="flex flex-grow flex-col p-8">
      <Header title="Lista de Usuarios" />
      <div className="flex gap-4 my-4">
        <Input
          type="text"
          placeholder="Busca un usuario"
          value={userSearched}
          onValueChange={setUserSearched}
          startContent={<span className="material-symbols-outlined icon-sm">search</span>}
        />
        <ModalAddUser />
      </div>

      {usersFiltered && <Table aria-label="Usuarios">
        <TableHeader columns={columns}>
          {columns.map(column => (
            <TableColumn key={column.id} align="center">
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody items={usersFiltered} emptyContent="Ningún resultado coincide">
          {(item) => (
            <TableRow key={item.id}>
              {
                (columnKey) => <TableCell>{renderCell(columnKey, item)}</TableCell>
              }
            </TableRow>
          )}
        </TableBody>
      </Table>}
    </div>
  );
}
