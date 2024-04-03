"use client";
import Header from "@/components/Header";
import ModalAddUser from "@/components/ModalAddUser";
import { Input, Table, TableBody, TableCell, TableRow, TableColumn, TableHeader, Button, Chip, User } from "@nextui-org/react";
import { useEffect, useState } from "react";

// TODO: Paginación (¿Cuántos elementos por página?)
// TODO: Conexión con el backend
// TODO: Centrar los elementos
// TODO: Navegar a la pantalla de usuario individual (No la tengo en mi rama aún)

interface User {
  id: number
  fullName: string
  activeModules: string[]
  status: boolean
  userName: string
}

const fakeData = [
  {
    "id": 1,
    "fullName": "John Doe",
    "activeModules": ["module1", "module2"],
    "status": true,
    "userName": "johndoe"
  },
  {
    "id": 2,
    "fullName": "Jane Smith",
    "activeModules": ["module3"],
    "status": false,
    "userName": "janesmith"
  },
  {
    "id": 3,
    "fullName": "Alice Johnson",
    "activeModules": ["module1", "module4"],
    "status": true,
    "userName": "alicejohnson"
  },
  {
    "id": 4,
    "fullName": "Bob Brown",
    "activeModules": ["module2", "module5"],
    "status": true,
    "userName": "bobbrown"
  },
  {
    "id": 5,
    "fullName": "Emma Davis",
    "activeModules": ["module3", "module6"],
    "status": false,
    "userName": "emmadavis"
  },
  {
    "id": 6,
    "fullName": "Michael Wilson",
    "activeModules": ["module4", "module7"],
    "status": true,
    "userName": "michaelwilson"
  },
  {
    "id": 7,
    "fullName": "Sarah Lee",
    "activeModules": ["module5", "module8"],
    "status": true,
    "userName": "sarahlee"
  },
  {
    "id": 8,
    "fullName": "David Rodriguez",
    "activeModules": ["module6", "module9"],
    "status": false,
    "userName": "davidrodriguez"
  },
  {
    "id": 9,
    "fullName": "Olivia Martinez",
    "activeModules": ["module7"],
    "status": true,
    "userName": "oliviamartinez"
  },
  {
    "id": 10,
    "fullName": "James Garcia",
    "activeModules": ["module8", "module9", "module10"],
    "status": false,
    "userName": "jamesgarcia"
  }
];
const columns = [
  { name: "Nombre", id: "name" },
  { name: "Módulos activos", id: "activeModules" },
  { name: "Estatus", id: "status" },
  { name: "Acciones", id: "actions" }
];

const renderCell = (columnKey: React.Key, user: User) => {
  if (columnKey == "name") return (
    <User
      name={user.fullName}
      description={user.userName}
    />
  );
  if (columnKey == "activeModules") return user.activeModules.length.toString();
  if (columnKey == "status") return (
    <Chip variant="solid" color={user.status ? "success" : "danger"}>{user.status ? "Activo" : "Inactivo"}</Chip>
  );
  if (columnKey == "actions") return (
    <div className="flex gap-2">
      <Button className="bg-transparent" isIconOnly>{<span className="material-symbols-outlined icon-sm">edit</span>}</Button>
      <Button color="danger" isIconOnly>{<span className="material-symbols-outlined icon-sm">delete</span>}</Button>
    </div>
  );
};

export default function AllUsersPage() {

  const [userSearched, setUserSearched] = useState("");
  const [usersFiltered, setUsersFiltered] = useState<User[]>(fakeData);
  const [users, setUsers] = useState<User[]>(fakeData);

  useEffect(() => {
    const userUpperCase = userSearched.toUpperCase();
    const currentUsersFiltered = users.filter(item => item.fullName.toUpperCase().includes(userUpperCase));
    if (currentUsersFiltered.length > 0 && userSearched.length > 0) setUsersFiltered(currentUsersFiltered);
    if (currentUsersFiltered.length > 0 && userSearched.length == 0) setUsersFiltered(users);
  }, [userSearched, users]);

  return (
    <div className="">
      <Header title="Lista de Usuarios" />
      <div className="flex gap-4 my-4">
        <Input
          type="text"
          placeholder="Busca un usuario"
          value={userSearched}
          onValueChange={setUserSearched}
          startContent={<span className="material-symbols-outlined icon-sm">search</span>}
        />
        <ModalAddUser currentUsers={users} setCurrentUsers={setUsers} />
      </div>
      <Table aria-label="Example table with custom cells">
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
      </Table>
    </div>
  );
}