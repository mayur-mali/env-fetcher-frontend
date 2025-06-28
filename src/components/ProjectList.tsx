import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { useState, useEffect, Fragment } from "react";

export interface Project {
  _id?: string;
  name: string;
  description?: string;
  envType?: string[];
  status?: string;
  isDeleted?: boolean;
  checked?: boolean;
  selectedEnvTypes?: string[];
}

interface ProjectListProps {
  initialProjects?: Project[] | [];
  title?: string;
  className?: string;
  onProjectsChange?: (projects: Project[]) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  initialProjects,
  title = "Projects",
  onProjectsChange,
}) => {
  const [projects, setProjects] = useState<Project[]>(() =>
    (initialProjects || []).map((project) => ({
      ...project,
      checked: project.checked ?? false,
      selectedEnvTypes: project.selectedEnvTypes ?? [],
    }))
  );

  useEffect(() => {
    if (onProjectsChange) {
      onProjectsChange(projects);
    }
  }, [projects, onProjectsChange]);

  // Handle project checkbox click - fixed to prevent continuous selection
  const handleProjectCheck = (
    projectId: string | undefined,
    event: React.MouseEvent
  ) => {
    // Stop event propagation to prevent bubbling
    event.stopPropagation();

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project._id === projectId) {
          const newCheckedState = !project.checked;
          return {
            ...project,
            checked: newCheckedState,
            selectedEnvTypes: newCheckedState
              ? [...(project.envType || [])]
              : [],
          };
        }
        return project;
      })
    );
  };

  const handleEnvTypeCheck = (
    projectId: string,
    envType: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project._id === projectId) {
          const currentSelectedEnvTypes = project.selectedEnvTypes || [];
          let newSelectedEnvTypes: string[];

          if (currentSelectedEnvTypes.includes(envType)) {
            // Remove env type if already selected
            newSelectedEnvTypes = currentSelectedEnvTypes.filter(
              (type) => type !== envType
            );
          } else {
            // Add env type if not selected
            newSelectedEnvTypes = [...currentSelectedEnvTypes, envType];
          }

          // Project is checked if at least one env type is selected
          const newCheckedState = newSelectedEnvTypes.length > 0;

          return {
            ...project,
            checked: newCheckedState,
            selectedEnvTypes: newSelectedEnvTypes,
          };
        }
        return project;
      })
    );
  };

  const isEnvTypeChecked = (project: Project, envType: string) => {
    return project.selectedEnvTypes?.includes(envType) || false;
  };

  return (
    <div className="w-full">
      {title && <h2 className="block text-sm font-semibold  mb-1">{title}</h2>}
      <Menu>
        <div>
          <MenuButton className="inline-flex w-full justify-between items-center border border-gray-300 rounded bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
            <span>
              {projects.filter((p) => p.checked).length &&
              projects.filter((p) => p.checked).length >= 1
                ? `${projects.filter((p) => p.checked).length} Project Selected`
                : "Select Project"}{" "}
            </span>
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded bg-white shadow-lg border border-gray-300 focus:outline-none max-h-60 overflow-y-auto">
            <div className="space-y-6 p-2">
              {projects.map((project) => (
                <div key={project._id} className="space-y-2">
                  <div className="flex items-start">
                    {/* Project checkbox - using onClick instead of onChange */}
                    <div
                      className={`w-6 h-6 flex items-center justify-center ${
                        project.status === "inactive" || project.isDeleted
                          ? "opacity-50 hover:cursor-not-allowed"
                          : ""
                      } ${
                        project.checked
                          ? "bg-blue-600"
                          : "border border-gray-300 bg-white"
                      } rounded cursor-pointer`}
                      onClick={(e) => {
                        if (
                          project.status === "inactive" ||
                          project.isDeleted
                        ) {
                          return;
                        }
                        handleProjectCheck(project._id, e);
                      }}
                    >
                      {project.checked && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                        </svg>
                      )}
                      {/* Hidden input for accessibility */}
                      <input
                        type="checkbox"
                        className="opacity-0 absolute w-0 h-0 disabled:cursor-not-allowed"
                        checked={project.checked || false}
                        disabled={
                          project.status === "inactive" || project.isDeleted
                        }
                        readOnly
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="ml-9 space-y-1">
                    {project.envType?.map((envType) => (
                      <div
                        key={`${project._id}-${envType}`}
                        className="flex items-center"
                      >
                        {/* Environment type checkbox - using onClick instead of onChange */}
                        <div
                          className={`w-5 h-5 flex items-center justify-center ${
                            project.status === "inactive" || project.isDeleted
                              ? "opacity-50 hover:cursor-not-allowed"
                              : ""
                          } ${
                            isEnvTypeChecked(project, envType)
                              ? "bg-blue-600"
                              : "border border-gray-300 bg-white"
                          } rounded cursor-pointer`}
                          onClick={(e) => {
                            if (
                              project._id &&
                              project.status !== "inactive" &&
                              !project.isDeleted
                            ) {
                              handleEnvTypeCheck(project._id, envType, e);
                            }
                          }}
                        >
                          {isEnvTypeChecked(project, envType) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                            </svg>
                          )}
                          {/* Hidden input for accessibility */}
                          <input
                            type="checkbox"
                            className="opacity-0 disabled:cursor-not-allowed absolute w-0 h-0"
                            checked={isEnvTypeChecked(project, envType)}
                            disabled={
                              project.status === "inactive" || project.isDeleted
                            }
                            readOnly
                          />
                        </div>
                        <span className="ml-2 capitalize">{envType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default ProjectList;
