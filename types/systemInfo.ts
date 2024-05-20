interface Measurement {
    statistic: string;
    value: number;
}

interface AvailableTag {
    tag: string;
    values: string[];
}

interface Metric {
    name: string;
    description: string;
    baseUnit: string | null;
    measurements: Measurement[];
    availableTags: AvailableTag[];
}

export interface HealthData {
    health: {
        status: string;
        components: {
            db?: {
                status: string;
                details: {
                    database: string;
                    validationQuery: string;
                };
            };
            diskSpace?: {
                status: string;
                details: {
                    total: number;
                    free: number;
                    threshold: number;
                    path: string;
                    exists: boolean;
                };
            };
            ping?: {
                status: string;
            };
            redis?: {
                status: string;
                details: {
                    version: string;
                };
            };
        };
    };
    metrics: Metric[];
}
