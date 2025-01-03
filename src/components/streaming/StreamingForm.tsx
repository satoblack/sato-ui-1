import { StreamProfile } from "./StreamProfile";
import { InputSettings } from "./InputSettings";

export const StreamingForm = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Stream Profile Management */}
        <div className="col-span-12 lg:col-span-4">
          <StreamProfile />
        </div>

        {/* Right Column - Input Settings */}
        <div className="col-span-12 lg:col-span-8">
          <InputSettings />
        </div>
      </div>
    </div>
  );
};