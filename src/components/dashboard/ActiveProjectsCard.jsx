import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import ProjectProgress from "@/components/common/ProjectProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { selectActiveProjectsWithProgress } from "@/store/selectors/dashboardSelectors";

export default function ActiveProjectsCard() {
  const { t } = useTranslation();
  const projects = useSelector(selectActiveProjectsWithProgress);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("dashboard.sections.activeProjects")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {projects.map((project) => (
            <div key={project.id} className="rounded-lg bg-muted/60 px-2 py-3">
              <p className="text-sm font-medium">{project.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {project.code} · {project.company}
              </p>
              <ProjectProgress value={project.progress} className="mt-2" />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="lg"
          className="w-full mt-2 hover:bg-brand-gradient hover:text-white"
        >
          {t("dashboard.actions.viewAll")}
        </Button>
      </CardContent>
    </Card>
  );
}
