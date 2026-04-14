import { RegisterMemberForm } from "./register-form";

export default function RegisterMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Register New Member</h1>
        <p className="text-muted-foreground mt-1">
          Complete all steps to register a member and activate their membership.
        </p>
      </div>
      <RegisterMemberForm />
    </div>
  );
}
