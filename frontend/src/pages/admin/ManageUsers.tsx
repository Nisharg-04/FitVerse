import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [roleLoading, setRoleLoading] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/getAllUsers?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        { withCredentials: true }
      );

      const payload = resp?.data?.data;
      if (!payload) {
        setUsers([]);
        setTotal(null);
        return;
      }

      if (Array.isArray(payload)) {
        setUsers(payload);
        setTotal(null);
        return;
      }

      // common paginated shapes
      if (Array.isArray(payload.users)) {
        setUsers(payload.users);
        setTotal(typeof payload.total === "number" ? payload.total : null);
        return;
      }

      if (Array.isArray(payload.docs)) {
        setUsers(payload.docs);
        setTotal(typeof payload.total === "number" ? payload.total : null);
        return;
      }

      // fallback: if payload.items
      if (Array.isArray((payload as any).items)) {
        setUsers((payload as any).items);
        setTotal(
          typeof (payload as any).total === "number"
            ? (payload as any).total
            : null
        );
        return;
      }

      // otherwise try to read data.users-like
      setUsers([]);
      setTotal(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
      setTotal(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/deleteUser/${id}`,
        {
          withCredentials: true,
        }
      );
      // refresh
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user. See console for details.");
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => navigate(-1)} variant={"outline"}>
            Back
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-muted-foreground">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Joined</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-sm text-muted-foreground"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-sm text-muted-foreground"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u: any) => (
                    <tr key={u._id ?? u.id ?? u.email} className="border-t">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name ?? "User avatar"}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : null}
                          <div>
                            <div className="font-medium">
                              {u.name ?? u.userName ?? u.fullName ?? "—"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {u.phone ?? ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">{u.email ?? "—"}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role ?? u.userRole ?? "user"}
                            onChange={async (e) => {
                              const newRole = e.target.value;
                              const id = u._id ?? u.id;
                              if (!id) return;
                              try {
                                setRoleLoading((s) => ({ ...s, [id]: true }));
                                await axios.post(
                                  `${
                                    import.meta.env.VITE_BACKEND_URL
                                  }/admin/changeUserRole/${id}`,
                                  { role: newRole },
                                  { withCredentials: true }
                                );
                                // optimistic update
                                setUsers((prev) =>
                                  prev.map((p) =>
                                    p._id === id || p.id === id
                                      ? { ...p, role: newRole }
                                      : p
                                  )
                                );
                              } catch (err) {
                                console.error(
                                  "Failed to change user role:",
                                  err
                                );
                                alert(
                                  "Failed to change user role. See console for details."
                                );
                              } finally {
                                setRoleLoading((s) => ({ ...s, [id]: false }));
                              }
                            }}
                            className="input border-muted-foreground bg-transparent text-sm w-auto px-2 py-1"
                            disabled={!!roleLoading[u._id ?? u.id ?? ""]}
                            aria-label={`Change role for ${u.name ?? u.email}`}
                          >
                            <option
                              className="border-muted-foreground bg-black text-sm w-auto  "
                              value="user"
                            >
                              user
                            </option>
                            <option
                              className="border-muted-foreground bg-black text-sm w-auto  "
                              value="admin"
                            >
                              admin
                            </option>
                            <option
                              className="border-muted-foreground bg-black text-sm w-auto  "
                              value="owner"
                            >
                              owner
                            </option>
                          </select>
                          {roleLoading[u._id ?? u.id ?? ""] ? (
                            <span className="text-sm text-muted-foreground">
                              Saving...
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-3">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={"destructive"}
                            size={"sm"}
                            onClick={() => handleDelete(u._id ?? u.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {page}
                {total ? ` of ${Math.ceil(total / limit)}` : ""}
              </span>
              <Button
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!!total && page >= Math.ceil(total / limit)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Per page</label>
              <select
                aria-label="Per page"
                title="Per page"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="input border-muted-foreground bg-transparent text-sm w-auto px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
