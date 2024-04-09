"use client";
import { generatePassword } from "@/utils";
import { Modal, ModalContent, ModalBody, Button, Autocomplete, AutocompleteItem, ModalHeader, Input, ModalFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
interface Phone {
  number: string
  isActive: boolean
}

interface Person {
  phone: null | Phone
  id: string
  name: string
  fatherLastName: string
  motherLastName: string
  email: string | null
  curp: string | null
  rfc: string | null
  birthPlace: string | null
  voterKey: string | null
  gender: string | null
  scholarship: string | null
  profession: string | null
  tagIDs: string[]
  ineURL: string | null
  proofAddressURL: string | null
  photoURL: string | null
}

export default function ModalAddUser() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [form, setForm] = useState({
    personName: "",
    selectedPersonId: "",
    username: "",
    password: generatePassword(12, true, true, true),
    roles: {
      "visor": "User",
      "whats": "Admin",
      "abc": "123"
    }
  });

  async function getPerson() {
    let query = "?user=false";
    if (form.personName.length > 0) {
      query += "&name=" + form.personName;
    }
    const res = await fetch("/dashboard/api/persons" + query, { method: "GET" }).then(res => res.json());
    console.log(res);
    if (res.data) setPeople(res.data);
  }

  useEffect(() => {
    if (!form.personName) return;

    const timeout = setTimeout(() => {
      console.log("Searching person:", form.personName);
      getPerson();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [form.personName]);


  const createUser = async () => {
    const { personName, selectedPersonId: personId, username, password, roles } = form;

    const res = (await fetch("/dashboard/api/users", {
      method: "POST",
      body: JSON.stringify({ personName, personId, username, password, roles })
    }).then(res => res.json()));

    console.log(res);

    if (res.code !== "OK") {
      return alert("Algo salió mal");
    }

    alert("Usuario creado correctamente");
    router.push("/dashboard/base/users/" + res.data.id);
  };
  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    createUser();

    // TODO: Connect to the backend
    setIsModalOpen(false);

    // Clear the form
    setForm({
      personName: "",
      selectedPersonId: "",
      username: "",
      password: generatePassword(12, true, true, true),
      roles: {
        "visor": "User",
        "whats": "Admin",
        "abc": "123"
      }
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
    const person = people.find((item) => item.id === value);
    if (!person) {
      return;
    }

    const newUserName = `${person.name.toLowerCase().split(" ")[0]}${person.fatherLastName.toLowerCase().slice(0, 3)}_${person.id.slice(-3)}`;

    setForm({
      ...form,
      personName: `${person.name} ${person.fatherLastName}`,
      selectedPersonId: String(person.id),
      username: newUserName
    });
  };

  const handlePersonSearch = (value: string) => {
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
                shouldCloseOnBlur
              >
                {people.map((person) =>
                  <AutocompleteItem key={person.id}>{`${person.name} ${person.fatherLastName} ${person.motherLastName}`}</AutocompleteItem>
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