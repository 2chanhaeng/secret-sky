import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AllowChoiceInfo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="size-3 rounded-full ml-1 mt-1"
        >
          <CircleHelp className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-md h-96 overflow-y-scroll">
        <div className="w-full flex flex-col gap-2">
          <p>
            <b>팔로잉</b>을 선택하면 작성자가 팔로우하고 있는 계정이 비밀글을 볼
            수 있습니다.
          </p>
          <p>
            <b>팔로워</b>를 선택하면 작성자를 팔로우하고 있는 계정이 비밀글을 볼
            수 있습니다.
          </p>
          <p>
            <b>멘션</b>을 선택하면 작성자가 공개글에 멘션한 계정이 비밀글을 볼
            수 있습니다.
          </p>
          <p>
            아무것도 선택하지 않으면 <u>모든 계정이 비밀글을 볼 수 있습니다.</u>{" "}
            만약 아무도 비밀글을 볼 수 없길 바란다면 아무도 멘션하지 않은 채로{" "}
            <b>멘션</b>을 선택하세요.
          </p>
          <p>
            여러 범위를 선택하면 선택된 범위 중 하나라도 속하는 모든 계정이
            비밀글을 볼 수 있습니다.
          </p>
          <p>
            글을 작성한 뒤에도 Bluesky 에서 <b>댓글을 남길 수 있는 범위</b>를
            수정하면 비밀글을 볼 수 있는 범위를 수정할 수 있습니다.
            <ol className="list-decimal list-inside ml-2">
              <li>
                Bluesky 에서 작성한 글의 작성 시간 아래에 있는{" "}
                <b>일부 사람들이 답글을 달 수 있음</b> 을 누릅니다.
                <img
                  src="/secret-post-help-1.png"
                  alt="댓글을 남길 수 있는 범위 수정방법"
                  className="w-full h-auto mt-2"
                />
              </li>
              <li>
                <b>답글을 허용할 대상</b>을 자신이 원하는 대로 수정합니다.
                <img
                  src="/secret-post-help-2.png"
                  alt="댓글을 남길 수 있는 범위 수정창"
                  className="w-full h-auto mt-2"
                />
              </li>
            </ol>
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
