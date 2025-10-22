type ProgressBarProps = {
    total: number;
    filled: number;
    percentage?: number;
    bgColor?: string;
    barColor?: string;
    height?: string;
    showLabel?: boolean;
};

export default function ProgressBar({
    total,
    filled,
    percentage,
    bgColor = 'bg-gray-200',
    barColor = 'bg-blue-500',
    height = 'h-4',
    showLabel = true
}: ProgressBarProps) {
    const displayPercentage = percentage || total > 0 ? Math.min(Math.max((filled / total) * 100, 0), 100) : 0;
    const roundedPercentage = Math.round(displayPercentage);

    return (
        <div className="w-full">
            <div className={`relative w-full ${height} ${bgColor} rounded-full overflow-hidden`}>
                <div
                    className={`${barColor} ${height} rounded-full transition-all duration-300 ease-in-out`}
                    style={{ width: `${displayPercentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{filled} / {total}</span>
                    <span>{roundedPercentage}%</span>
                </div>
            )}
        </div>
    );
}