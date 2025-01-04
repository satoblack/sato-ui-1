import { StreamProfile } from "./StreamProfile";

export const StreamingForm = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <StreamProfile />
        </div>
      </div>
    </div>
  );
};