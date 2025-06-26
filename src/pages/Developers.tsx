import React, { useEffect } from "react";
import { createDeveloperApi, getAllDevelopersApi } from "../services/api";
import { CreateDeveloper } from "../types/apiType";
import { Table } from "../components/Table";
import Modal from "../components/Modal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";

export default function Developers() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [developers, setDevelopers] = React.useState<CreateDeveloper[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  useEffect(() => {
    const fetchAllDevelopers = async () => {
      try {
        setLoading(true);
        const data = await getAllDevelopersApi();
        setDevelopers(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDevelopers();
  }, []);

  const createDeveloper = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (data.password !== data.confirmPassword) {
      return toast.error("password not match");
    }
    try {
      setLoading(true);
      const res = await createDeveloperApi({
        email: data.email.toString(),
        name: data.name.toString(),
        password: data.password.toString(),
      });

      if (res) {
        setIsOpen(false);
        toast.success("Developer created successfully");
        const data = await getAllDevelopersApi();
        setDevelopers(data);
      }
    } catch (error) {
      toast.error("Failed to create developer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Modal title={"Create Project"} open={isOpen} setOpen={setIsOpen}>
        <form onSubmit={createDeveloper}>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold">Developer Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              required
              //value={projectName}
              //onChange={(e) => setProjectName(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-semibold">Enter Email ID</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email ID"
              required
              //value={projectName}
              //onChange={(e) => setProjectName(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-semibold">Enter Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              required
              //value={projectName}
              //onChange={(e) => setProjectName(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-semibold">
              {" "}
              Enter Confirm Password{" "}
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              //value={projectName}
              //onChange={(e) => setProjectName(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 h-10 disabled:bg-custom-black/50 bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
            >
              {false ? (
                <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
              ) : (
                "Create Developer"
              )}
            </button>
          </div>
        </form>
      </Modal>
      <Table
        pagination={true}
        minHeight={" h-auto"}
        searchBox={
          <div className="flex justify-between items-center w-full ">
            <h1 className="text-2xl font-bold">Developer List</h1>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-1.5 cursor-pointer bg-custom-black text-white rounded-full text-sm font-bold shadow"
            >
              Create Developer
            </button>
          </div>
        }
        loading={loading}
        data={[
          ["Developer Name", "Email ID", "Action"],
          ...(developers
            ? developers?.map((dev) => [dev.name, dev.email, "-"])
            : []),
        ]}
      />
    </div>
  );
}
