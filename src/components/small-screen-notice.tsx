import { PowerIcon } from "lucide-react";

export function SmallScreenNotice() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
      <div className="flex max-w-sm flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-full bg-toggl-pink">
            <PowerIcon className="size-5 text-sidebar-primary-foreground" />
          </span>
          <span className="text-xl font-bold tracking-tight">
            toggl <span className="font-normal">track</span>
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Toggl 2.0 works better on bigger screens
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Toggl 2.0 is still in the early stages, so for now, we recommend
            using it on a larger screen for the smoothest experience.
          </p>
        </div>
      </div>
    </div>
  );
}
