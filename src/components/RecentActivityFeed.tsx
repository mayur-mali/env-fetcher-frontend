import React from "react";

interface ActivityPerformer {
  _id: string;
  email: string;
}

interface Activity {
  _id: string;
  action: string;
  performedBy: ActivityPerformer;
  description: string;
  createdAt: string;
  metadata: Record<string, any>;
  updatedAt: string;
}

interface RecentActivityFeedProps {
  activities: Activity[];
}

const getActionBadge = (description: string) => {
  const badges: { [key: string]: { color: string; label: string } } = {
    "group created": { color: "bg-green-100 text-green-800", label: "Created" },
    "developer access updated": {
      color: "bg-blue-100 text-blue-800",
      label: "Updated",
    },
    "developer deleted": { color: "bg-red-100 text-red-800", label: "Deleted" },
    "developers assigned to group": {
      color: "bg-purple-100 text-purple-800",
      label: "Assigned",
    },
    "developer updated": {
      color: "bg-yellow-100 text-yellow-800",
      label: "Modified",
    },
  };

  const defaultBadge = { color: "bg-gray-100 text-gray-800", label: "Action" };
  const badge = badges[description] || defaultBadge;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
    >
      {badge.label}
    </span>
  );
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date(); // Using the provided current time
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
}) => {
  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl h-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Activity Feed
            </h2>
            <span className="text-sm text-gray-500">
              {activities.length} activities
            </span>
          </div>

          <div className="space-y-6 overflow-y-scroll max-h-96">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start space-x-6 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150 ease-in-out"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {activity.performedBy.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <p className="text-xs text-gray-500">
                            by {activity.performedBy.email.split("@")[0]}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {getActionBadge(activity.description)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No recent activities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivityFeed;
