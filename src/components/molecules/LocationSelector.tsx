"use client";

import {
    useGetStatesQuery,
    useGetCitiesQuery,
} from "@/features/location/locationApi";
import { skipToken } from "@reduxjs/toolkit/query";
import CustomSelect from "@/components/atoms/CustomSelect";
import { useEffect } from "react";

/* -------------------------------- TYPES -------------------------------- */

type GridSpan = {
    base?: 12 | 6 | 4 | 3;
    md?: 12 | 6 | 4 | 3;
    lg?: 12 | 6 | 4 | 3;
};

interface LocationSelectorProps {
    stateId: number | null;
    cityId: number | null;
    onStateChange: (value: number) => void;
    onCityChange: (value: number) => void;
    stateCol?: GridSpan;
    cityCol?: GridSpan;
    stateError?: string;
    cityError?: string;
}

/* ------------------ STATIC GRID MAP (TAILWIND SAFE) ------------------ */

const gridMap = {
    base: {
        12: "col-span-12",
        6: "col-span-6",
        4: "col-span-4",
        3: "col-span-3",
    },
    md: {
        12: "md:col-span-12",
        6: "md:col-span-6",
        4: "md:col-span-4",
        3: "md:col-span-3",
    },
    lg: {
        12: "lg:col-span-12",
        6: "lg:col-span-6",
        4: "lg:col-span-4",
        3: "lg:col-span-3",
    },
};

/* ------------------ GRID CLASS BUILDER ------------------ */

const buildGridClass = (span?: GridSpan) => {
    if (!span) return "col-span-12";

    return [
        span.base && gridMap.base[span.base],
        span.md && gridMap.md[span.md],
        span.lg && gridMap.lg[span.lg],
    ]
        .filter(Boolean)
        .join(" ");
};

/* -------------------------- COMPONENT -------------------------- */

export default function LocationSelector({
    stateId,
    cityId,
    onStateChange,
    onCityChange,
    stateCol = { base: 12 },
    cityCol = { base: 12 },
    stateError,
    cityError,
}: LocationSelectorProps) {
    const { data: states } = useGetStatesQuery();
    const { data: cities } = useGetCitiesQuery(stateId ?? skipToken);

    useEffect(() => {
        console.log("cities loaded:", cities);
    }, [cities]);

    return (
        <div className="grid grid-cols-12 gap-4">
            {/* STATE */}
            <div className={buildGridClass(stateCol)}>
                <CustomSelect
                    label="State"
                    name="state"
                    value={stateId ?? ""}
                    onChange={(e) => onStateChange(Number(e.target.value))}
                    options={states?.map(s => ({
                        id: s.stateId,
                        name: s.stateName,
                    })) || []}
                    error={stateError}
                />
            </div>

            {/* CITY */}
            <div className={buildGridClass(cityCol)}>
                <CustomSelect
                    label="City"
                    name="city"
                    value={cityId ?? ""}
                    disabled={!stateId}
                    onChange={(e) => onCityChange(Number(e.target.value))}
                    options={cities?.map(c => ({
                        id: c.cityId,
                        name: c.cityName,
                    })) || []}
                    error={cityError}
                />
            </div>
        </div>
    );
}
