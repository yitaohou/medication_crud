import { getRefillStatus } from "@/app/utils";

type RefillBadgeProps = { 
    refillDate: Date;
    remainingDosage: number;
};

export default function RefillBadge({ refillDate, remainingDosage }: RefillBadgeProps) {
    const status = getRefillStatus(refillDate, remainingDosage);

    if (status === 'normal') {
        return null; // No badge for normal status
    }

    const badgeConfig = {
        'expired': {
            text: 'Expired',
            className: 'bg-red-100 text-red-700 border-red-300'
        },
        'ending-soon': {
            text: 'Ending',
            className: 'bg-yellow-100 text-yellow-700 border-yellow-300'
        }
    };

    const config = badgeConfig[status];

    return (
        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded border ${config.className}`}>
            {config.text}
        </span>
    );
}