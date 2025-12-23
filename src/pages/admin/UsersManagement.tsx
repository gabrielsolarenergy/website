import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Shield,
  Edit,
  Trash2,
  Loader2,
  UserPlus,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { adminAPI } from "@/lib/api";
import AdminLayout from "@/components/layout/AdminLayout";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "user" | "admin" | "editor" | "sales" | "support";
  phone_number?: string;
  location?: string;
  created_at: string;
}

const UsersManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "user" as User["role"],
    phone_number: "",
    location: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await adminAPI.getUsers();
      if (error) throw new Error(error);
      setUsers(data || []);
    } catch (e: any) {
      toast({
        title: "Eroare",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "",
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone_number: user.phone_number || "",
      location: user.location || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.email || !formData.first_name || !formData.last_name) {
      toast({
        title: "Eroare",
        description: "Completează câmpurile obligatorii.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        phone_number: formData.phone_number || undefined,
        location: formData.location || undefined,
      };

      const { error } = selectedUser
        ? await adminAPI.updateUser(selectedUser.id, payload)
        : await adminAPI.createUser({
            ...payload,
            password: formData.password,
          });

      if (error) throw new Error(error);

      toast({
        title: selectedUser ? "Utilizator actualizat!" : "Utilizator creat!",
        description: "Modificările au fost salvate cu succes.",
      });
      setIsDialogOpen(false);
      fetchUsers();
    } catch (e: any) {
      toast({
        title: "Eroare",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const { error } = await adminAPI.deleteUser(selectedUser.id);
      if (error) throw new Error(error);
      toast({ title: "Șters", description: "Utilizatorul a fost eliminat." });
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (e: any) {
      toast({
        title: "Eroare",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.first_name} ${u.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Gestionare <span className="text-[#1a4925]">Utilizatori</span>
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Caută după nume sau email..."
            className="pl-12 rounded-xl border-slate-100 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-[#1a4925]" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Utilizator
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Rol
                  </th>
                  <th className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#1a4925]">
                          {u.first_name[0]}
                          {u.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {u.first_name} {u.last_name}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 p-2 rounded-2xl"
                        >
                          <DropdownMenuItem
                            onClick={() => handleEdit(u)}
                            className="rounded-xl cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2" /> Editează
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(u);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 rounded-xl cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Șterge
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dialog Editare (Ca în image_a6d846.png) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">
              {selectedUser ? "Editează Utilizator" : "Adaugă Utilizator"}
            </DialogTitle>
            <DialogDescription>
              Modifică informațiile utilizatorului.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">
                Prenume <span className="text-red-500">*</span>
              </Label>
              <Input
                className="rounded-xl"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">
                Nume <span className="text-red-500">*</span>
              </Label>
              <Input
                className="rounded-xl"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="font-bold text-slate-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                className="rounded-xl"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {!selectedUser && (
              <div className="space-y-2 col-span-2">
                <Label className="font-bold text-slate-700">
                  Parolă <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Minim 8 caractere"
                  className="rounded-xl"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            )}
            <div className="space-y-2 col-span-2">
              <Label className="font-bold text-slate-700">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(v: any) =>
                  setFormData({ ...formData, role: v })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Telefon</Label>
              <Input
                className="rounded-xl"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Locație</Label>
              <Input
                className="rounded-xl"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-2xl h-12 px-8 font-bold text-slate-600"
            >
              Anulează
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#1a4925] hover:bg-[#12331a] rounded-2xl h-12 px-8 font-bold"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : "Salvează"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmare Ștergere */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl">
              Ești sigur?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune va șterge permanent utilizatorul{" "}
              {selectedUser?.first_name} {selectedUser?.last_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">
              Anulează
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 rounded-xl font-bold"
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default UsersManagement;
