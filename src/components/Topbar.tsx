"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Group, Text, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import NotificationCentre from "@/components/NotificationCentre";

type TopbarProps = {
  email: string;
  selectedSeason: number;
  seasonOptions: number[];
  seasonRangeLabel: string;
};

export default function Topbar({
  email,
  selectedSeason,
  seasonOptions,
  seasonRangeLabel,
}: TopbarProps) {
  const supabase = createClient();
  const router = useRouter();
  const [season, setSeason] = useState(String(selectedSeason));
  const [isSavingSeason, setIsSavingSeason] = useState(false);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function updateSeason(nextSeason: string) {
    setSeason(nextSeason);
    setIsSavingSeason(true);

    try {
      await fetch("/api/season", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ season: nextSeason }),
      });

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSavingSeason(false);
    }
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
          <div className="am-season-picker">
            <label className="am-season-picker-label" htmlFor="season-select">Season</label>
            <select
              id="season-select"
              className="form-select am-season-select"
              value={season}
              onChange={(event) => void updateSeason(event.target.value)}
              disabled={isSavingSeason}
            >
              {seasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="am-season-picker-hint">{seasonRangeLabel}</span>
          </div>
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
