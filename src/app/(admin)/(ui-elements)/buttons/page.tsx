import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Buttons | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Buttons page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Buttons() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Buttons" />
      <div className="space-y-5 sm:space-y-6">
        {/* Primary Button */}
        <ComponentCard title="Primary Button">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary">
              Button Text
            </Button>
            <Button size="md" variant="primary">
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Primary Button with Start Icon */}
        <ComponentCard title="Primary Button with Left Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" startIcon={<Icon name="BoxIcon" />}>
              Button Text
            </Button>
            <Button size="md" variant="primary" startIcon={<Icon name="BoxIcon" />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>{" "}
        {/* Primary Button with Start Icon */}
        <ComponentCard title="Primary Button with Right Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" endIcon={<Icon name="BoxIcon" />}>
              Button Text
            </Button>
            <Button size="md" variant="primary" endIcon={<Icon name="BoxIcon" />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Outline Button */}
        <ComponentCard title="Secondary Button">
          <div className="flex items-center gap-5">
            {/* Outline Button */}
            <Button size="sm" variant="primary" outline>
              Button Text
            </Button>
            <Button size="md" variant="primary" outline>
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Outline Button with Start Icon */}
        <ComponentCard title="Outline Button with Left Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" outline startIcon={<Icon name="BoxIcon" />}>
              Button Text
            </Button>
            <Button size="md" variant="primary" outline startIcon={<Icon name="BoxIcon" />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>{" "}
        {/* Outline Button with Start Icon */}
        <ComponentCard title="Outline Button with Right Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" outline endIcon={<Icon name="BoxIcon" />}>
              Button Text
            </Button>
            <Button size="md" variant="primary" outline endIcon={<Icon name="BoxIcon" />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
