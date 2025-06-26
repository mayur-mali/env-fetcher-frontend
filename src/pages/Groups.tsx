import React, { useEffect } from "react";
import { Table } from "../components/Table";
import {
  createGroupApi,
  deleteGroupApi,
  getAllGroupsApi,
} from "../services/api";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

export default function Groups() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [groups, setGroups] = React.useState<any>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        setLoading(true);
        const data = await getAllGroupsApi();
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllGroups();
  }, []);

  const createGroup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      setLoading(true);
      const res = await createGroupApi({
        name: data.name.toString(),
        description: data.description.toString(),
      });

      if (res) {
        setIsOpen(false);
        toast.success("Group created successfully");
        const data = await getAllGroupsApi();
        setGroups(data);
      }
    } catch (error) {
      toast.error("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      setLoading(true);
      await deleteGroupApi(groupId);
      toast.success("Group deleted successfully");
      const data = await getAllGroupsApi();
      setGroups(data);
    } catch (error) {
      toast.error("Failed to delete group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal title={"Create Group"} open={isOpen} setOpen={setIsOpen}>
        <form onSubmit={createGroup}>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold">Group Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-semibold">Description </label>
            <input
              type="text"
              name="description"
              placeholder="Enter Description"
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 h-10 disabled:bg-custom-black/50 bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
              ) : (
                "Create Group"
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
            <h1 className="text-2xl font-bold">Group List</h1>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-1.5 cursor-pointer bg-custom-black text-white rounded-full text-sm font-bold shadow"
            >
              Create Group
            </button>
          </div>
        }
        loading={loading}
        data={[
          ["Group Name", "Description", "Action"],
          ...(groups
            ? groups?.map((group) => [
                group.name,
                group.description,
                <MdDelete
                  onClick={() => deleteGroup(group._id)}
                  className="cursor-pointer text-xl"
                />,
              ])
            : []),
        ]}
      />
    </div>
  );
}
