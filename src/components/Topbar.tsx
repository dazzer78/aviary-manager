"use client";

import { Avatar, Badge, Button, Group, Text, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import NotificationCentre from "@/components/NotificationCentre";

export default function Topbar({ email }: { email: string }) {
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const userName = email?.split("@")[0] || "User";

  return (
    <header className="am-topbar">
      <Group justify="space-between" align="center" w="100%">
        <Group gap="md">
          <div>
            <Text fw={700} size="xl" c="neutral.9">Dashboard</Text>
            <Text size="sm" c="dimmed">Overview of your breeding operations</Text>
          </div>
          <Badge variant="light" color="dark" radius="md">Season 2026</Badge>
        </Group>

        <Group gap="md" className="topbar-actions">
          <TextInput
            leftSection={<Search size={16} />}
            placeholder="Search birds, rings, cages..."
            radius="xl"
            w={300}
          />
          <NotificationCentre />
          <Group gap="xs">
            <Avatar radius="xl" color="dark">{userName.charAt(0).toUpperCase()}</Avatar>
            <Text size="sm" c="dimmed">{userName}</Text>
            <Button variant="outline" color="red" size="xs" onClick={logout}>Logout</Button>
          </Group>
        </Group>
      </Group>
    </header>
  );
}
