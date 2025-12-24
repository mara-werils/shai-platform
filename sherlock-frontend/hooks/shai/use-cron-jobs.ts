import { useState, useEffect } from 'react';
import { 
  fetchCronJobs, 
  deleteCronJob, 
  createCronJob, 
  updateCronJob,
  fetchCronJob,
  type CronJob 
} from '@/service/shai/cron';

export const useCronJobs = (appId: string) => {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCronJobs(appId);
      setCronJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cron jobs');
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (cronJob: Omit<CronJob, 'id' | 'created_at' | 'updated_at' | 'last_executed_at'>) => {
    try {
      setError(null);
      const newJob = await createCronJob(appId, cronJob);
      setCronJobs(prev => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cron job');
      throw err;
    }
  };

  const updateJob = async (id: number, updates: Partial<CronJob>) => {
    try {
      setError(null);
      const updatedJob = await updateCronJob(appId, id, updates);
      setCronJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      return updatedJob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cron job');
      throw err;
    }
  };

  const deleteJob = async (id: number) => {
    try {
      setError(null);
      await deleteCronJob(appId, id);
      setCronJobs(prev => prev.filter(job => job.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete cron job');
      throw err;
    }
  };

  useEffect(() => {
    if (appId) {
      fetchJobs();
    }
  }, [appId]);

  return {
    cronJobs,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    refetch: fetchJobs,
  };
};

export const useCronJob = (appId: string, jobId: number) => {
  const [cronJob, setCronJob] = useState<CronJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCronJob(appId, jobId);
      setCronJob(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cron job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appId && jobId) {
      fetchJob();
    }
  }, [appId, jobId]);

  return {
    cronJob,
    loading,
    error,
    refetch: fetchJob,
  };
}; 