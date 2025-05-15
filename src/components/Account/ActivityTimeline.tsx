import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

type ActivityLog = {
  type: string; // 'added_library', 'compared'
  message: string;
  timestamp: string;
};

const ActivityTimeline = () => {
  const { user, firebaseUser } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.uid) return;
      const ref = collection(db, `users/${user.uid}/activityLogs`);
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map((doc) => doc.data() as ActivityLog);
      setLogs(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    };

    fetchLogs();
  }, [user?.uid]);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Activity History</h3>
      <ul className="space-y-2 text-sm">
        <li className="text-muted-foreground">
          Last login: {firebaseUser?.metadata?.lastSignInTime
            ? new Date(firebaseUser.metadata.lastSignInTime).toLocaleString()
            : "N/A"}
        </li>
        {logs.map((log, i) => (
          <li key={i} className="text-muted-foreground">
            • {log.message} <span className="text-xs text-gray-400 ml-2">({new Date(log.timestamp).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityTimeline;
