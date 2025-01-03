import { StreamProfile } from "./StreamProfile";
import { InputSettings } from "./InputSettings";
import { StreamControls } from "./StreamControls";
import { StreamMonitor } from "./StreamMonitor";

export const StreamingForm = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Stream Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <StreamProfile />
          <InputSettings />
          <StreamControls />
        </div>

        {/* Right Column - Preview and Monitor */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <StreamMonitor />
        </div>
      </div>
    </div>
  );
};