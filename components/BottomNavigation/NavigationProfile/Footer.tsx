import LoginForm from "@/app/auth/login/components/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useDeleteAccount } from "@/hooks/use-logged-account";
import { useProfile } from "@/hooks/use-profile";

export function NavigationProfileFooter() {
  return (
    <DrawerFooter className="gap-4 pt-0">
      <AddAccount />
      <Logout />
    </DrawerFooter>
  );
}

function AddAccount() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="outline" className="w-full">
          계정 추가
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>계정 추가</DrawerTitle>
          <DrawerDescription className="pt-4">
            <LoginForm redirectTo="/" />
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-4 pt-0">
          <Button variant="outline" className="w-full">
            계정 추가
          </Button>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              뒤로 가기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Logout() {
  const { profile, deleteProfile } = useProfile();
  const deleteFromDb = useDeleteAccount(profile?.did ?? "");
  const useLogout = () => {
    deleteFromDb();
    deleteProfile();
    window.location.replace("/auth/logout");
  };
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="destructive" className="w-full">
          로그아웃
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>로그아웃</DrawerTitle>
          <DrawerDescription>정말로 로그아웃 하시겠습니까?</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-4 pt-0">
          <Button variant="destructive" className="w-full" onClick={useLogout}>
            로그아웃
          </Button>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              뒤로 가기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
