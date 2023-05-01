import { useTheme } from "next-themes";
import { Icons } from "~/components/ui/icons";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Tabs
      defaultValue={theme}
      value={theme}
      onValueChange={(val) => setTheme(val)}
    >
      <TabsList>
        <TabsTrigger
          value="system"
          data-state={theme === "system" ? "active" : ""}
        >
          <Icons.laptop className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="light">
          <Icons.sun className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="dark">
          <Icons.moon className="w-4 h-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
