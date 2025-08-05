import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";

interface PasswordFields {
  currentPassword: string;
  newPassword: string;
  passwordConfirm: string;
}

const PasswordChange: React.FC = () => {

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState<PasswordFields>({
    currentPassword: "",
    newPassword: "",
    passwordConfirm: "",
  });
  const [disBtn, setDisBtn] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisBtn(true);

    try {
      const res = await api.patch("/users/updatePassword", password, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Password changed successfully");
      setPassword({
        currentPassword: "",
        newPassword: "",
        passwordConfirm: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error: " + error.message);
    } finally {
      setDisBtn(false);
    }
  };

  return (
    <div>
      <div className="space-y-2">
            {!open && 
            <button
            onClick={() => setOpen(true)}
            className="bg-space-purple/80 hover:bg-space-purple/60 text-white px-6 py-2 rounded transition-colors">Change Password
            </button>
            }
            {open && 
            <>
             <h1>CHANGE PASSWORD</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <Label className="flex flex-col items-start gap-2">
            Current password
            <input
              type="password"
              onChange={handleChange}
              name="currentPassword"
              value={password.currentPassword}
              placeholder="*******"
              className="p-2 bg-space-purple/10 border-space-purple/30"
            />
          </Label>
          <Label className="flex flex-col items-start gap-2">
            New Password
            <input
              type="password"
              onChange={handleChange}
              name="newPassword"
              value={password.newPassword}
              placeholder="*******"
              className="p-2 bg-space-purple/10 border-space-purple/30"
            />
          </Label>
          <Label className="flex flex-col items-start gap-2">
            Confirm Password
            <input
              type="password"
              onChange={handleChange}
              name="passwordConfirm"
              value={password.passwordConfirm}
              placeholder="*******"
              className="p-2 bg-space-purple/10 border-space-purple/30"
            />
          </Label>
          <div className="flex w-full">
            <Button type="submit" disabled={disBtn}>
              {disBtn ? "SAVING..." : "SAVE PASSWORD"}
            </Button>
            {/* <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
            </Button> */}
          </div>
        </form>
            </>
            }
       
      </div>
    </div>
  );
};

export default PasswordChange;
