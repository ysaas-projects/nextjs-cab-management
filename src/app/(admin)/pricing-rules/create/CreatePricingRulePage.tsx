"use client";

import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/CustomInput";
import {
  pricingRuleSchema,
  useCreatePricingRuleMutation,
} from "@/features/pricingRule";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

export default function CreatePricingRulePage() {
  const [createPricingRule, { isLoading }] =
    useCreatePricingRuleMutation();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

  // ✅ FirmId REMOVED
  const [form, setForm] = useState({
    ruleDetails: "",
    isActive: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm({
        ...form,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    setErrors({});
    setFormError(null);

    // ✅ validate WITHOUT firmId
    const result = pricingRuleSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      setFormError("Please fix the errors below and try again.");
      return;
    }

    try {
      const response = await createPricingRule(result.data).unwrap();

      enqueueSnackbar("Pricing rule created successfully", {
        variant: "success",
      });

      // ✅ redirect to view page
      router.push(`/pricing-rules/${response.pricingRuleId}`);
    } catch (err) {
      setFormError(
        "Something went wrong while saving the pricing rule."
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Add New Pricing Rule
        </h1>
        <p className="text-sm text-gray-500">
          Provide pricing rule details
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="space-y-10 p-6">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          {/* Pricing Rule Info */}
          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Pricing Rule Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                 <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Rule Details
              </label>
              <textarea
                name="ruleDetails"
                value={form.ruleDetails}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pricing rule details..."
              />
              {errors.ruleDetails && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ruleDetails}
                </p>
              )}
            </div>
            
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Is Active
                </label>
              </div>
            </div>

           
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Button variant="default" onClick={() => router.back()}>
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={isLoading}
            >
              Save Pricing Rule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
