import { Stack, Text, TooltipHost } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import * as React from 'react';

const datediff = (first: Date, second: Date) => {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
}

const PrettyPrintDate = (days: number) => {
    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);

    if (years > 0)
        return years + " Year(s) ago";
    if (months > 0)
        return months + " Month(s) ago";
    return days + " Day(s) ago";
}


export interface IPrettyDateProps {
    date: Date;
    label: string;
    override?: string;
}

export const PrettyDate: React.FunctionComponent<IPrettyDateProps> = (props: React.PropsWithChildren<IPrettyDateProps>) => {
    const tooltipId = useId('tooltip');
    const days = props.date ? datediff(props.date, new Date()) : null;


    return (
        <>

            <TooltipHost
                content={props.date ? props.date.toLocaleString() : "N/A"}
                id={tooltipId}
                calloutProps={{ gapSpace: 0 }}
            >
                <Stack>
                    <Text style={{ fontWeight: 'bold' }}>{props.label}</Text>
                    {props.override && <Text>{props.override}</Text>}
                    {props.override == null &&
                        <>
                            {days == null && <Text>N/A</Text>}
                            {days != null && <Text>{PrettyPrintDate(days)}</Text>}
                        </>
                    }
                </Stack>
            </TooltipHost >
        </>
    );
};