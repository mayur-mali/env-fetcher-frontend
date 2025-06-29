import React, { use, useEffect } from "react";
import {
  createDeveloperApi,
  deleteDeveloperApi,
  getAllDevelopersApi,
  updateDeveloperApi,
} from "../services/api";
import { CreateDeveloper } from "../types/apiType";
import { Table } from "../components/Table";
import Modal from "../components/Modal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import ToggleButton from "@components/ToggleButton";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsExclamationTriangle } from "react-icons/bs";
import ConfirmationDialog from "@components/ConfirmationDialog";

type DeleteDeveloperProps = {
  id: string | undefined;
};

const UpdateDeveloper = ({ dev }: any) => {
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const updateDeveloper = useMutation({
    mutationFn: updateDeveloperApi,
    onSuccess: () => {
      toast.success("Developer updated successfully");
      setIsUpdateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllDevelopers"] });
    },
    onError: () => {
      toast.error("Failed to update developer");
    },
  });

  const handleUpdateDeveloper = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    updateDeveloper.mutate({
      developerId: dev?._id,
      name: data.name.toString(),
      isActive: data.status === "active" ? true : false,
    });
  };

  return (
    <div>
      <FaUserEdit
        onClick={() => {
          setIsUpdateOpen(true);
        }}
        className="text-2xl text-gray-600 cursor-pointer"
      />
      <Modal
        open={isUpdateOpen}
        setOpen={setIsUpdateOpen}
        type="drawer"
        position="bottom"
        customDimensions={{
          width: "w-full",
          height: "h-[50vh]",
        }}
      >
        <div className="max-w-md mx-auto h-full ">
          <h2 className="font-medium text-2xl text-gray-900 mt-2">
            Update Developer
          </h2>
          <p className="leading-6 mt-2 text-gray-600">
            Update the details of the developer account. Ensure that the email
            is correct, as it will be used for login. You can also change the
            developer's name and status.
          </p>
          <form onSubmit={handleUpdateDeveloper}>
            <div className="flex flex-col min-h-[46vh] pb-4">
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Developer Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={dev?.name}
                required
                className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
              />
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Enter Email ID
              </label>
              <input
                type="email"
                name="email"
                disabled
                value={dev?.email}
                className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
              />
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Status
              </label>
              <div className="flex">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  defaultChecked={dev?.isActive}
                />
                <span className="ml-2">Active</span>
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  className="ml-4"
                  defaultChecked={!dev?.isActive}
                />
                <span className="ml-2">Inactive</span>
              </div>

              <button
                type="submit"
                className="h-[44px] mt-4 bg-black text-gray-50 rounded-lg disabled:cursor-not-allowed cursor-pointer disabled:bg-black/50 w-full font-medium"
              >
                {false ? (
                  <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
                ) : (
                  "Update Developer"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

const DeleteDeveloper: React.FC<DeleteDeveloperProps> = ({ id }) => {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const deleteDeveloper = useMutation({
    mutationFn: deleteDeveloperApi,
    onSuccess: () => {
      toast.success("Developer deleted successfully");
      setIsDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllDevelopers"] });
    },
    onError: () => {
      toast.error("Failed to delete developer");
    },
  });
  return (
    <div>
      <RiDeleteBin6Line
        onClick={() => {
          setIsDeleteOpen(true);
        }}
        className="text-2xl text-red-400 cursor-pointer"
      />
      <Modal open={isDeleteOpen} className="max-w-md" setOpen={setIsDeleteOpen}>
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            deleteDeveloper.mutate(id as string);
          }}
          title="Delete Developer"
          description="Are you sure you want to delete this developer? This action cannot be undone."
          IconComponent={BsExclamationTriangle}
          confirmText="Yes, Delete"
          cancelText="No, Keep It"
        />
      </Modal>
    </div>
  );
};

export default function Developers() {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { data: getAllDeveloper, isLoading } = useQuery({
    queryKey: ["getAllDevelopers"],
    queryFn: getAllDevelopersApi,
  });

  const createDeveloper = useMutation({
    mutationFn: createDeveloperApi,
    onSuccess: () => {
      toast.success("Developer Created...");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllDevelopers"] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });

  const handleDeveloperCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (data.password !== data.confirmPassword) {
      return toast.error("password not match");
    }
    createDeveloper.mutate({
      email: data.email.toString(),
      name: data.name.toString(),
      password: data.password.toString(),
    });
  };

  return (
    <div className="p-4">
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        type="drawer"
        position="bottom"
        customDimensions={{
          width: "w-full",
          height: "h-[60vh]",
        }}
      >
        <div className="max-w-md mx-auto h-full ">
          <h2 className="font-medium text-2xl text-gray-900 mt-2">
            Create New Developer
          </h2>
          <p className="leading-6 mt-2 text-gray-600">
            Fill in the details below to create a new developer account. Ensure
            that the email and password are correct, as they will be used for
            login.
          </p>
          <form onSubmit={handleDeveloperCreate}>
            <div className="flex flex-col min-h-[46vh] pb-4">
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Developer Name
              </label>
              <input
                type="text"
                name="name"
                required
                //value={projectName}
                //onChange={(e) => setProjectName(e.target.value)}
                className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
              />
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Enter Email ID
              </label>
              <input
                type="email"
                name="email"
                required
                //value={projectName}
                //onChange={(e) => setProjectName(e.target.value)}
                className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
              />
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Enter Password
              </label>
              <input
                type="password"
                name="password"
                required
                //value={projectName}
                //onChange={(e) => setProjectName(e.target.value)}
                className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
              />
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                {" "}
                Enter Confirm Password{" "}
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                //value={projectName}
                //onChange={(e) => setProjectName(e.target.value)}
                className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
              />
              <button
                type="submit"
                disabled={createDeveloper.isPending}
                className="h-[44px] mt-4 bg-black text-gray-50 rounded-lg disabled:cursor-not-allowed cursor-pointer disabled:bg-black/50 w-full font-medium"
              >
                {createDeveloper.isPending ? (
                  <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
                ) : (
                  "Create Developer"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Table
        minHeight={" h-auto"}
        loading={isLoading}
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
        data={[
          ["Developer Name", "Email ID", "Created At", "Status", " Actions"],
          ...(getAllDeveloper
            ? getAllDeveloper?.map((dev) => [
                dev.name,
                dev.email,
                dev.createdAt ? new Date(dev.createdAt).toLocaleString() : "-",
                <ToggleButton
                  isOn={dev.isActive}
                  handleToggle={() => {
                    // updatedev.mutate({
                    //   projectId: dev._id,
                    //   projectDetails: {
                    //     status:
                    //       dev.isActive === true ? "inactive" : "active",
                    //   },
                    // });
                  }}
                  className="ml-2"
                />,
                <div className="flex items-center gap-5">
                  <UpdateDeveloper dev={dev} />
                  <DeleteDeveloper id={dev?._id} />
                </div>,
              ])
            : []),
        ]}
      />
    </div>
  );
}
