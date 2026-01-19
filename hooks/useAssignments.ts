import {useState, useEffect, useCallback} from 'react';

export interface Assignment {
    id: string;
    title: string;
    description: string;
    duedate?: string;
    dueDate?: string;
    subject: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
}

export const useAssignments = (userId?: string) => {
     const [assignments, setAssignments] = useState<Assignment[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const fetchAssignments = useCallback(async (useRefresh: boolean | null) => {
         if (!userId || userId.trim() === '') return;

         if (useRefresh || useRefresh === null) {
             setLoading(true);
         }

         setError(null);

         try {
             const response = await fetch('https://acadme-backend.onrender.com/api/assignments/' + userId);

             if (!response.ok) {
                 throw new Error(`Failed to fetch assignments: ${response.status}`);
             }

             const data = await response.json();
             setAssignments(data);
         } catch (err: any) {
             setError(err.message);
             console.error('Error fetching assignments:', err);
         } finally {
             setLoading(false);
         }

     }, [userId]);

     const getAssignmentById = (assignmentId: string) => {
         return assignments.find(a => a.id === assignmentId);
     }

     const createAssignment = async (assignmentData: Assignment) => {
       if (!userId || userId.trim() === '') {
           const errMsg = 'Missing userId - cannot create assignment';
           setError(errMsg);
           console.error(errMsg);
           return { success: false, error: errMsg };
       }

       setLoading(true);
       setError(null);

       try {
           const payload = {
               userId,
               title: assignmentData.title,
               description: assignmentData.description,
               dueDate: (assignmentData as any).duedate ?? (assignmentData as any).dueDate,
               subject: assignmentData.subject,
               priority: assignmentData.priority ?? 'medium',

               completed: assignmentData.completed ?? false,
           };

           const response = await fetch('https://acadme-backend.onrender.com/api/assignments', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify(payload),
           });

           if (!response.ok) {
               let backendMessage = '';
               try {
                   const errBody = await response.json();
                   backendMessage = errBody?.message ? ` - ${errBody.message}` : '';
               } catch {
               }
               throw new Error(`Failed to create assignment: ${response.status}${backendMessage}`);
           }

           const newAssignment = await response.json();
           setAssignments(prev => [newAssignment, ...prev]);

           return {success: true, data: newAssignment};
       } catch (err: any) {
           setError(err.message);
           console.error('Error creating assignment:', err);
           return {success: false, error: err.message};
       } finally {
           setLoading(false);
       }
   };

    const updateAssignment = async (assignmentId: string, updateData: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://acadme-backend.onrender.com/api/assignments/${assignmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) {
                throw new Error(`Failed to update assignment: ${response.status}`);
            }

            const updatedAssignment = await response.json();
            setAssignments(prev => prev.map(a => a.id === assignmentId ? updatedAssignment : a));
            return {success: true, data: updatedAssignment};
        } catch (err: any) {
            setError(err.message);
            console.error('Error updating assignment:', err);
            return {success: false, error: err.message};
        } finally {
            setLoading(false);
        }
    };

    const toggleCompletion = async (assignmentId: string) => {
        setLoading(true);
        setError(null);

        try {
            const assignment = assignments.find(a => a.id === assignmentId);
            if (!assignment) {
                throw new Error('Assignment not found');
            }

            const response = await fetch(`https://acadme-backend.onrender.com/api/assignments/${assignmentId}/toggle`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                throw new Error(`Failed to toggle completion: ${response.status}`);
            }

            const updatedAssignment = await response.json();
            setAssignments(prev => prev.map(a => a.id === assignmentId ? updatedAssignment : a));
            return {success: true, data: updatedAssignment};
        } catch (err: any) {
            setError(err.message);
            console.error('Error toggling assignment completion:', err);
            return {success: false, error: err.message};
        } finally {
            setLoading(false);
        }
    };

    const deleteAssignment = async (assignmentId: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://acadme-backend.onrender.com/api/assignments/${assignmentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete assignment: ${response.status}`);
            }

            setAssignments(prev => prev.filter(a => a.id !== assignmentId));
            return {success: true};
        } catch (err: any) {
            setError(err.message);
            console.error('Error deleting assignment:', err);
            return {success: false, error: err.message};
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignmentsBySubject = async (subject: string) => {
        if (!userId || userId.trim() === '') {
            const errMsg = 'Missing userId - cannot fetch assignments by subject';
            setError(errMsg);
            console.error(errMsg);
            return { success: false, error: errMsg };
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://acadme-backend.onrender.com/api/assignments/${userId}/subject/${subject}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch assignments by subject: ${response.status}`);
            }

            const data = await response.json();
            return {success: true, data};
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching assignments by subject:', err);
            return {success: false, error: err.message};
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
         fetchAssignments();
     }, [fetchAssignments]);

    const getCompletedAssignments = () => {
        return assignments.filter(a => a.completed);
    };

    const getPendingAssignments = () => {
        return assignments.filter(a => !a.completed);
    };

    const getLateAssignments = () => {
        const now = new Date();
        return assignments.filter(a => {
            if (a.completed) return false;
            const d = (a as any).duedate ?? (a as any).dueDate;
            if (!d) return false;
            return new Date(d) < now;
        });
    };

    const getAssignmentsByPriority = (priority: 'low' | 'medium' | 'high') => {
        return assignments.filter(a => a.priority === priority);
    };
    return {
        assignments,
        loading,
        error,

        createAssignment,
        updateAssignment,
        deleteAssignment,
        toggleCompletion,
        fetchAssignmentsBySubject,
        fetchAssignments,
        getAssignmentById,

        getCompletedAssignments,
        getPendingAssignments,
        getLateAssignments,
        getAssignmentsByPriority,

        clearError: () => setError(null),
    };
}

export default useAssignments;