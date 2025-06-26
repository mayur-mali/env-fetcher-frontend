import React from "react";

type ActivityType =
  | "project_created"
  | "token_created"
  | "token_deleted"
  | "developer_access_assigned"
  | "developer_added"
  | "developer_removed"
  | "group_access_assigned"
  | "group_created"
  | "group_deleted"
  | "env_uploaded"
  | "env_deleted"
  | undefined;

// Define the activity item interface
interface ActivityItem {
  _id: string;
  type?: ActivityType | string | undefined;
  user?: string;
  action?: string;
  subject?: string;
  createdAt: string;
  message: string;
}

// Props interface for the component
interface RecentActivityProps {
  activities?: ActivityItem[];
  showEmailButton?: boolean;
  className?: string;
}

// Activity icon component
const ActivityIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
  const getIconConfig = (type: ActivityType) => {
    switch (type) {
      case "project_created":
        return {
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          ),
        };

      case "token_created":
        return {
          bgColor: "bg-green-100",
          iconColor: "text-green-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          ),
        };

      case "token_deleted":
        return {
          bgColor: "bg-red-100",
          iconColor: "text-red-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 9l6 6m0-6l-6 6"
              />
            </svg>
          ),
        };

      case "developer_access_assigned":
        return {
          bgColor: "bg-purple-100",
          iconColor: "text-purple-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4"
              />
            </svg>
          ),
        };

      case "developer_added":
        return {
          bgColor: "bg-green-100",
          iconColor: "text-green-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          ),
        };

      case "developer_removed":
        return {
          bgColor: "bg-red-100",
          iconColor: "text-red-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 8l-6 6m0-6l6 6"
              />
            </svg>
          ),
        };

      case "group_access_assigned":
        return {
          bgColor: "bg-indigo-100",
          iconColor: "text-indigo-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4"
              />
            </svg>
          ),
        };

      case "group_created":
        return {
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m3-3H9"
              />
            </svg>
          ),
        };

      case "group_deleted":
        return {
          bgColor: "bg-red-100",
          iconColor: "text-red-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 9l6 6m0-6l-6 6"
              />
            </svg>
          ),
        };

      case "env_uploaded":
        return {
          bgColor: "bg-emerald-100",
          iconColor: "text-emerald-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          ),
        };

      case "env_deleted":
        return {
          bgColor: "bg-orange-100",
          iconColor: "text-orange-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 9l6 6m0-6l-6 6"
              />
            </svg>
          ),
        };

      default:
        return {
          bgColor: "bg-gray-100",
          iconColor: "text-gray-600",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const { bgColor, iconColor, icon } = getIconConfig(type);

  return (
    <div
      className={`flex-shrink-0 w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}
    >
      <span className={iconColor}>{icon}</span>
    </div>
  );
};

// Activity item component
const ActivityItemComponent: React.FC<{ activity: ActivityItem }> = ({
  activity,
}) => {
  return (
    <div className="flex items-start space-x-3 py-3">
      <ActivityIcon type={activity.type as ActivityType} />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-900">
          <span className="font-medium">{activity.user}</span>
          <span className="mx-1">{activity.message}</span>
          {activity.subject && (
            <span className="font-medium italic">{activity.subject}</span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {new Date(activity.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// Main RecentActivity component
const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [],
  showEmailButton = true,
  className = "",
}) => {
  const handleSendEmail = () => {
    console.log("Send email clicked");
    // Add your email functionality here
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        {showEmailButton && (
          <button
            onClick={handleSendEmail}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Send Email
          </button>
        )}
      </div>

      {/* Activity List */}
      <div className="p-6">
        <div className="space-y-1">
          {activities.map((activity) => (
            <ActivityItemComponent key={activity._id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
export type { ActivityItem, ActivityType, RecentActivityProps };
