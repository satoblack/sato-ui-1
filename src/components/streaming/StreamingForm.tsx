import { StreamProfile } from "./StreamProfile";
import { InputSettings } from "./InputSettings";
import { StreamControls } from "./StreamControls";

export const StreamingForm = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Stream Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <StreamProfile />
        </div>

        {/* Right Column - Input Settings and Controls */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <InputSettings />
          <StreamControls />
        </div>
      </div>
    </div>
  );
};