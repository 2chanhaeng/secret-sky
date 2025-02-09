"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BaseProfile } from "@/types/profile";
import { NavigationProfileFooter } from "./Footer";
import NavigationProfileList from "./List";

export default function NavigationProfile(profile: BaseProfile) {
  const { avatar, handle } = profile;
  return (
    <Drawer>
      <DrawerTrigger>
        <Avatar>
          <AvatarImage src={avatar} alt={handle} />
          <AvatarFallback>{handle}</AvatarFallback>
        </Avatar>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>프로필</DrawerTitle>
          <DrawerDescription>
            <NavigationProfileList {...profile} />
          </DrawerDescription>
        </DrawerHeader>
        <NavigationProfileFooter />
      </DrawerContent>
    </Drawer>
  );
}
