import { Button } from "@fe/components/button";
import { Card, CardContent } from "@fe/components/card/simple-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@fe/components/dropdown-menu";
import { PillLightCoral, PillLightGreen } from "@fe/components/pill/colorful";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@fe/components/table";
import { tableData } from "@fe/data/website-statistics";
import { DollarIcon } from "@fe/icons/dollar-icon";
import { DotsVerticalIcon } from "@fe/icons/dots-vertical-icon";
import { EyeIcon } from "@fe/icons/eye-icon";
import { AppLayout } from "@fe/patterns/app-layout";

export const DashboardWithLayoutPage = () => {
  return (
    // <AppLayout>
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="flex flex-1 h-full overflow-y-auto flex-col p-6 gap-6">
        <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          <Card role="region" aria-labelledby="text-card-icon-action-title">
            <CardContent>
              <div className="blink-surface-light p-2 rounded-full inline-block">
                <EyeIcon className="w-8 h-8 rounded-full" />
              </div>
              <h3
                id="text-card-icon-action-title"
                className="text-xl blink-text-primary my-2"
              >
                32 567{" "}
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-sm blink-text-subdued">Views last month</p>
                <PillLightGreen className="h-6 inline-flex items-center gap-2">
                  10% ↑
                </PillLightGreen>
              </div>
            </CardContent>
          </Card>

          <Card role="region" aria-labelledby="text-card-icon-action-title">
            <CardContent>
              <div className="blink-surface-light p-2 rounded-full inline-block">
                <EyeIcon className="w-8 h-8 rounded-full" />
              </div>
              <h3
                id="text-card-icon-action-title"
                className="text-xl blink-text-primary my-2"
              >
                11 334{" "}
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-sm blink-text-subdued">Views last 7 days</p>
                <PillLightGreen className="h-6 inline-flex items-center gap-2">
                  23% ↑
                </PillLightGreen>
              </div>
            </CardContent>
          </Card>

          <Card role="region" aria-labelledby="text-card-icon-action-title">
            <CardContent>
              <div className="blink-surface-light p-2 rounded-full inline-block">
                <DollarIcon className="w-8 h-8 rounded-full" />
              </div>
              <h3
                id="text-card-icon-action-title"
                className="text-xl blink-text-primary my-2"
              >
                11 035
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-sm blink-text-subdued">Revenue last year</p>
                <PillLightCoral className="h-6 inline-flex items-center gap-2">
                  12% ↓
                </PillLightCoral>
              </div>
            </CardContent>
          </Card>

          <Card role="region" aria-labelledby="text-card-icon-action-title">
            <CardContent>
              <div className="blink-surface-light p-2 rounded-full inline-block">
                <DollarIcon className="w-8 h-8 rounded-full" />
              </div>
              <h3
                id="text-card-icon-action-title"
                className="text-xl blink-text-primary my-2"
              >
                800
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-sm blink-text-subdued">Revenue last month</p>
                <PillLightCoral className="h-6 inline-flex items-center gap-2">
                  6% ↓
                </PillLightCoral>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="blink-surface-default border blink-border-container-white rounded-lg p-4">
          <h3 className="text-base bold pb-6 px-2">
            Website statistics last three month
          </h3>
          <div className="w-full overflow-auto">
            <Table className="min-w-[44rem]">
              <TableHead>
                <TableRow>
                  <TableHeadCell>Source</TableHeadCell>
                  <TableHeadCell>Visitors</TableHeadCell>
                  <TableHeadCell>Revenue</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Action</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>{row.visitors}</TableCell>
                    <TableCell>{row.revenue}</TableCell>
                    <TableCell>
                      {row.status === "up" ? (
                        <PillLightGreen>{row.statusText}</PillLightGreen>
                      ) : (
                        <PillLightCoral>{row.statusText}</PillLightCoral>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        trigger={
                          <DropdownMenuTrigger>
                            <Button appearance="text" className="w-10">
                              <DotsVerticalIcon className="w-8 h-8 shrink-0" />
                            </Button>
                          </DropdownMenuTrigger>
                        }
                      >
                        <DropdownMenuContent>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Add to watchlist</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
          <Card role="region" aria-labelledby="text-card-icon-action-title">
            <CardContent>
              <div className="blink-surface-light p-2 rounded-full inline-block">
                <EyeIcon className="w-8 h-8 rounded-full" />
              </div>
              <h3
                id="text-card-icon-action-title"
                className="text-xl blink-text-primary my-2"
              >
                $115 234
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-sm blink-text-subdued">Revenue last month</p>
                <PillLightGreen className="h-6 inline-flex items-center gap-2">
                  30% ↑
                </PillLightGreen>
              </div>
            </CardContent>
          </Card>

          <Card role="region" aria-labelledby="text-card-icon-action-title">
            <CardContent>
              <div className="blink-surface-light p-2 rounded-full inline-block">
                <EyeIcon className="w-8 h-8 rounded-full" />
              </div>
              <h3
                id="text-card-icon-action-title"
                className="text-xl blink-text-primary my-2"
              >
                $55 667
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-sm blink-text-subdued">
                  Revenue last 7 days
                </p>
                <PillLightGreen className="h-6 inline-flex items-center gap-2">
                  23% ↑
                </PillLightGreen>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    // </AppLayout>
  );
};
