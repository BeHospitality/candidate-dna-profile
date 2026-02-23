import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { ExperiencePath } from "@/data/questions";

export interface ParticipantData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  roleTitle: string;
  referralSource: string;
}

interface ParticipantDetailsProps {
  experiencePath: ExperiencePath;
  onContinue: (participantId: string) => void;
}

const COUNTRIES = [
  "Ireland",
  "United Kingdom",
  "United States",
  "UAE",
  "France",
  "Germany",
  "Spain",
  "Netherlands",
  "Other Europe",
  "Other",
];

const REFERRAL_SOURCES = [
  "Social Media",
  "Friend or Colleague",
  "My Employer Sent Me",
  "Job Board",
  "Be Connect Website",
  "Google Search",
  "Other",
];

const ParticipantDetails = ({ experiencePath, onContinue }: ParticipantDetailsProps) => {
  const [form, setForm] = useState<ParticipantData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    roleTitle: "",
    referralSource: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ParticipantData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (form.firstName.trim().length < 2) newErrors.firstName = "Min 2 characters";
    if (form.lastName.trim().length < 2) newErrors.lastName = "Min 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValid =
    form.firstName.trim().length >= 2 &&
    form.lastName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("dna_participants")
        .insert({
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || null,
          country: form.country || null,
          role_title: form.roleTitle.trim() || null,
          referral_source: form.referralSource || null,
          assessment_path: experiencePath,
        })
        .select("id")
        .single();

      if (error) throw error;
      onContinue(data.id);
    } catch (err) {
      console.error("Failed to save participant:", err);
      // Continue anyway — don't block assessment
      onContinue("local-" + Date.now());
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof ParticipantData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-navy-radial flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-3">Before We Begin</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We'll need a few details to save your DNA profile.
            <br />
            Your results will be ready immediately after the assessment.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-5">
          {/* First Name */}
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="Your first name"
              className="bg-background/50 border-border"
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Your last name"
              className="bg-background/50 border-border"
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@example.com"
              className="bg-background/50 border-border"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone
            </Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+353 ..."
              className="bg-background/50 border-border"
            />
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Country</Label>
            <Select value={form.country} onValueChange={(v) => updateField("country", v)}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Role */}
          <div className="space-y-1.5">
            <Label htmlFor="roleTitle" className="text-sm font-medium text-foreground">
              Current Role
            </Label>
            <Input
              id="roleTitle"
              value={form.roleTitle}
              onChange={(e) => updateField("roleTitle", e.target.value)}
              placeholder="e.g. Student, Barista, Waiting Staff, Hotel Receptionist"
              className="bg-background/50 border-border"
            />
          </div>

          {/* How did you find us? */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">How did you find us?</Label>
            <Select value={form.referralSource} onValueChange={(v) => updateField("referralSource", v)}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {REFERRAL_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            size="lg"
            className="w-full rounded-xl font-bold mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue to Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed max-w-sm mx-auto">
          Your details are stored securely and never shared without your consent.
          We use this information to save your DNA profile and send you your results.{" "}
          <a href="https://be.ie/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            See our Privacy Policy
          </a>.
        </p>
      </motion.div>
    </div>
  );
};

export default ParticipantDetails;
