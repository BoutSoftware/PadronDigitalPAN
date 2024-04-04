"use client";
import { generatePassword } from "@/utils";
import { Modal, ModalContent, ModalBody, Button, Autocomplete, AutocompleteItem, ModalHeader, Input, ModalFooter } from "@nextui-org/react";
import { Key, useState } from "react";

const fakeData: { id: string, name: string, lastname: string }[] = [
  {
    id: "1",
    name: "Sophia",
    lastname: "Taylor",
  },
  {
    id: "2",
    name: "Ethan",
    lastname: "Anderson"
  },
  {
    id: "3",
    name: "Ava",
    lastname: "Wilson"
  },
  {
    id: "4",
    name: "Noah",
    lastname: "Thomas"
  },
  {
    id: "5",
    name: "Isabella",
    lastname: "White"
  },
  {
    id: "6",
    name: "William",
    lastname: "Martinez"
  },
  {
    id: "7",
    name: "Mia",
    lastname: "Brown"
  },
  {
    id: "8",
    name: "Liam",
    lastname: "Lee"
  },
  {
    id: "9",
    name: "Amelia",
    lastname: "Rodriguez"
  },
  {
    id: "10",
    name: "Benjamin",
    lastname: "Garcia"
  }
];

export default function ModalAddUser() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    personName: "",
    selectedPersonId: "",
    username: "",
    password: generatePassword(12, true, true, true)
  });

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    // TODO: Connect to the backend
    setIsModalOpen(false);

    // Alert the user
    alert("Usuario agregado correctamente");

    // Clear the form
    setForm({
      personName: "",
      selectedPersonId: "",
      username: "",
      password: generatePassword(12, true, true, true)
    });
  };

  const handleGeneratePassword = () => {
    const password = generatePassword(12, true, true, true);
    setForm({ ...form, password });
  };

  const handleCopyPassword = async () => {
    await navigator.clipboard.writeText(form.password);
    alert("Contraseña copiada en el portapapeles");
  };

  const handlePersonSelection = (value: Key) => {
    console.log("Selected person:", value);

    const person = fakeData.find((item) => item.id === value)!;
    const newUserName = `${person.name.toLowerCase()}${person.lastname.toLowerCase().slice(0, 3)}${person.id.slice(0, 2)}`;

    setForm({
      ...form,
      personName: `${person.name} ${person.lastname}`,
      selectedPersonId: String(person.id),
      username: newUserName
    });
  };

  const handlePersonSearch = (value: string) => {
    console.log("Searching person:", value);
    setForm({ ...form, personName: value });
  };

  return (
    <>
      <Button onPress={() => setIsModalOpen(!isModalOpen)} color="secondary" className="min-w-min">
        Agregar usuario
      </Button>

      <Modal size="xl" isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h4>Agregando un usuario</h4>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Autocomplete
                startContent={<span className="material-symbols-outlined icon-sm">search</span>}
                label="Persona"
                placeholder="Selecciona una persona"
                onInputChange={handlePersonSearch}
                onSelectionChange={handlePersonSelection}
                value={form.personName}
                inputValue={form.personName}
                isRequired
              >
                {fakeData.map((person) =>
                  <AutocompleteItem key={person.id}>{`${person.name} ${person.lastname}`}</AutocompleteItem>
                )}
              </Autocomplete>

              <Input
                type="text"
                value={form.username}
                onValueChange={(value) => setForm({ ...form, username: value })}
                label="Usuario"
                placeholder="Asigna un nombre de usuario"
                startContent={<span className="material-symbols-outlined">person</span>}
                isRequired
              />

              <div className="flex gap-4 items-center">
                <Input
                  type="text"
                  value={form.password}
                  onValueChange={(value) => setForm({ ...form, password: value })}
                  label="Contraseña"
                  placeholder="Asigna un nombre de usuario"
                  startContent={<span className="material-symbols-outlined">key</span>}
                  endContent={
                    <Button
                      className="self-center"
                      radius="full"
                      variant="light"
                      isIconOnly
                      onPress={handleCopyPassword}
                    >
                      <span className="material-symbols-outlined icon">content_copy</span>
                    </Button>
                  }
                  isRequired
                />

                <Button color="secondary" onPress={handleGeneratePassword} className="min-w-min">
                  Generar contraseña
                </Button>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="secondary"
                size="lg"
                fullWidth
                type="submit"
              >
                Agregar usuario
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal >
    </>
  );
}