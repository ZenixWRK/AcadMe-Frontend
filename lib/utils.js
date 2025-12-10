export function normalizeDate(input) {
    if (!input && input !== 0) return null;

    if (typeof input === 'object' && !(input instanceof Date)) {
        const maybe = input.dueDate ?? input.duedate ?? input.date ?? null;
        if (maybe) return normalizeDate(maybe);
        return null;
    }

    if (input instanceof Date) {
        return isNaN(input.getTime()) ? null : input;
    }

    if (typeof input === 'number') {
        const d = new Date(input);
        return isNaN(d.getTime()) ? null : d;
    }

    const date = new Date(String(input));
    return isNaN(date.getTime()) ? null : date;
}

export function formatDateShort(input) {
    const date = normalizeDate(input);
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
    });
}

export function daysUntil(input) {
    const dateObj = normalizeDate(input);
    if (!dateObj) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const compareDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const diffTime = compareDate - today;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getDueDateFromAssignment(obj) {
    if (!obj) return null;
    return obj.dueDate ?? obj.duedate ?? null;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
