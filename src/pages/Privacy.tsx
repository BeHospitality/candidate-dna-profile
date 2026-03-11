import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
        </Link>

        <h1 className="text-3xl font-extrabold text-foreground mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground/90 leading-relaxed">
            Be Connect collects your personal data (name, email, work history) to:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Generate your career DNA profile</li>
            <li>Match you with suitable hospitality roles</li>
            <li>Provide career development insights</li>
          </ul>

          <p className="leading-relaxed">
            Your data is stored securely and only shared with employers you apply to.
          </p>

          <p className="leading-relaxed">
            You can request deletion at any time by contacting{" "}
            <a
              href="mailto:privacy@beconnect.ie"
              className="text-primary underline hover:text-primary/80"
            >
              privacy@beconnect.ie
            </a>
          </p>

          <div className="border-t border-border pt-6 mt-8">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Data Controller:</strong> Be Connect Ltd, Ireland
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
