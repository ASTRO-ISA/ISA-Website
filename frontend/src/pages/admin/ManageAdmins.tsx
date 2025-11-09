import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateAccount from "../authentication/CreateAccount";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import SpinnerOverlay from "@/components/ui/SpinnerOverlay";
import { Helmet } from "react-helmet-async";

type Admin = {
  _id: string;
  name: string;
  email: string;
  phoneNo: string | number;
  role: string;
  avatar?: string;
  createdAt: string;
  newPassword?: string;
};

const ManageAdmins = () => {
  const queryClient = useQueryClient();
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Fetch admins
  const {
    data: admins = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await api.get("/super-admin/admins");
      return res.data.data;
    },
  });

  // Delete mutation
  const deleteAdminMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/super-admin/admin/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  type AdminUpdatePayload = {
    name?: string;
    email?: string;
    phoneNo?: string | number;
  };

  // Update mutation
  const updateAdminMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      email,
      newPassword,
    }: {
      id: string;
      name: string;
      email: string;
      newPassword?: string;
    }) => {
      await api.patch(`/super-admin/admin/${id}`, {
        name,
        email,
        ...(newPassword ? { newPassword } : {}), // include only if entered
      });
    },
    onSuccess: () => {
      setEditingAdmin(null);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  if (isError)
    return (
      <p className="text-center mt-4 text-red-500">
        Error fetching admins: {error.message}
      </p>
    );

  return (
    <div className="p-6 space-y-6">
      <Helmet>
        <title>Admin: Manage Admins | ISA-India</title>
        <meta name="description" content="Admin page for managing admins." />
      </Helmet>
      <h1 className="text-2xl font-bold">Managing Admins</h1>

      {/* Create Admin Toggler */}
      <div className="space-y-2">
        <Button
          variant={showCreate ? "secondary" : "default"}
          onClick={() => setShowCreate((prev) => !prev)}
        >
          {showCreate ? "Close Create Admin" : "Create Admin"}
        </Button>

        {showCreate && (
          <div className="mt-4 p-4 border rounded bg-space-purple/10">
            <h2 className="text-lg font-semibold mb-2">Add a New Admin</h2>
            <CreateAccount url="/super-admin/admins" />
          </div>
        )}
      </div>

      {/* Admin List */}
      <SpinnerOverlay show={isLoading}>
        {admins.length === 0 ? (
          <p className="p-4 border rounded-xl shadow-md bg-space-purple/20 flex flex-col space-y-2">
            No admins created yet. Use the "Create Admin" button above.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {admins.map((admin: Admin) => (
              <div
                key={admin._id}
                className="p-4 border rounded-xl shadow-md bg-space-purple/20 flex flex-col space-y-2"
              >
                {/* Avatar */}
                <img
                  src={
                    admin.avatar === "profile-dark.webp"
                      ? `images/${admin.avatar}`
                      : admin.avatar
                  }
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full mx-auto"
                />

                {/* Details */}
                {editingAdmin && editingAdmin._id === admin._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingAdmin.name}
                      onChange={(e) =>
                        setEditingAdmin({
                          ...editingAdmin,
                          name: e.target.value,
                        })
                      }
                      className="border rounded p-2 w-full text-white bg-slate-900"
                    />
                    <input
                      type="email"
                      value={editingAdmin.email}
                      onChange={(e) =>
                        setEditingAdmin({
                          ...editingAdmin,
                          email: e.target.value,
                        })
                      }
                      className="border rounded p-2 w-full text-white bg-slate-900"
                    />
                    {/*New Password Field */}
                    <input
                      type="password"
                      placeholder="New Password (optional)"
                      onChange={(e) =>
                        setEditingAdmin({
                          ...editingAdmin,
                          newPassword: e.target.value,
                        })
                      }
                      className="border rounded p-2 w-full text-white bg-slate-900"
                    />

                    <div className="flex justify-between">
                      <Button
                        size="sm"
                        onClick={() =>
                          updateAdminMutation.mutate({
                            id: admin._id,
                            name: editingAdmin.name,
                            email: editingAdmin.email,
                            newPassword: editingAdmin.newPassword, // include password if provided
                          })
                        }
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingAdmin(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <p className="text-lg font-semibold text-center">
                      {admin.name}
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      {admin.email}
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      {admin.phoneNo}
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      Role: {admin.role}
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                      Created: {new Date(admin.createdAt).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="flex justify-around mt-2">
                      <Button size="sm" onClick={() => setEditingAdmin(admin)}>
                        Edit
                      </Button>
                      <Button
  variant="destructive"
  size="sm"
  onClick={() => {
    if (window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      deleteAdminMutation.mutate(admin._id)
    }
  }}
>
  Delete
</Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </SpinnerOverlay>
    </div>
  );
};

export default ManageAdmins;
