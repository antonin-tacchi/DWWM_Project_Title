import { create } from 'zustand';

let _id = 0;

const useNotificationStore = create((set) => ({
  notifications: [],   // { id, type, title, message, duration, read }

  add: ({ type = 'info', title, message, duration = 5000 }) => {
    const id = ++_id;
    set((s) => ({
      notifications: [
        ...s.notifications,
        { id, type, title, message, duration, read: false },
      ],
    }));
    return id;
  },

  remove: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  clear: () => set({ notifications: [] }),
}));

export default useNotificationStore;
