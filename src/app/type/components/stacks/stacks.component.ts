import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FilterService } from '../../../service/filter.service';
import { StackService } from '../../../service/stack.service';
import { LinkService } from '../../../service/link.service';
import { PaginationService } from '../../../service/pagination.service';
import { NotificationService } from '../../../service/notification.service';
import { StacksActionsService } from '../../../service/stacks-actions.service';

@Component({
    selector: 'app-stacks',
    templateUrl: './stacks.component.html',
    styleUrls: ['./stacks.component.less'],
})

export class StacksComponent implements OnInit {
    @Input() settings;
    @Input() eventType;
    next: string;
    previous: string;
    stacks: any[] = [];
    actions: any[];
    selectedIds: any[] = [];
    pageSummary: string;
    currentOptions: any;
    loading = true;
    showType: any;

    constructor(
        private filterService: FilterService,
        private stackService: StackService,
        private linkService: LinkService,
        private paginationService: PaginationService,
        private notificationService: NotificationService,
        private stacksActionsService: StacksActionsService,
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.actions = this.stacksActionsService.getActions();
        this.showType = this.settings['summary'] ? this.settings['showType'] : !this.filterService.getEventType();
        this.get();
    }

    canRefresh(data) {
        if (!!data && data.type === 'Stack') {
            return this.filterService.includedInProjectOrOrganizationFilter({ organizationId: data.organization_id, projectId: data.project_id });
        }

        if (!!data && data.type === 'Organization' || data.type === 'Project') {
            return this.filterService.includedInProjectOrOrganizationFilter({organizationId: data.id, projectId: data.id});
        }

        return !data;
    }

    get(options?) {
        const onSuccess = (response, link) => {
            this.stacks = JSON.parse(JSON.stringify(response));

            if (this.selectedIds) {
                this.selectedIds = this.selectedIds.filter((id) => {
                    return this.stacks.filter(function (e) {
                        return e.id === id;
                    }).length > 0;
                });
            }

            const links = this.linkService.getLinksQueryParameters(link);
            this.previous = links['previous'];
            this.next = links['next'];

            this.pageSummary = this.paginationService.getCurrentPageSummary(response, this.currentOptions.page, this.currentOptions.limit);

            if (this.stacks.length === 0 && this.currentOptions.page && this.currentOptions.page > 1) {
                return this.get();
            }

            return this.stacks;
        };

        const onFailure = (response) => {
        };

        this.loading = true;
        this.stacks = [];
        this.currentOptions = options || this.settings.options;

        return new Promise((resolve, reject) => {
            this.stackService.getFrequent(this.currentOptions).subscribe(
                res => {
                    onSuccess(res.body, res.headers.get('link'));
                    this.loading = false;

                    resolve(this.stacks);
                },
                err => {
                    this.notificationService.error('Error Occurred!', 'Failed');

                    reject(err);
                }
            );
        });
    }

    nextPage() {
        return this.get(this.next);
    }

    previousPage() {
        return this.get(this.previous);
    }

    updateSelection() {
        if (this.stacks && this.stacks.length === 0) {
            return;
        }

        if (this.selectedIds.length > 0) {
            this.selectedIds = [];
        } else {
            this.selectedIds = this.stacks.map((stack) => {
                return stack.id;
            });
        }

    }

    save(action) {
        const onSuccess = () => {
            this.selectedIds = [];
        };

        if (this.selectedIds.length === 0) {
            this.notificationService.info('Please select one or more stacks', 'Success');
        } else {
            /*this.action.run(this.selectedIds).then(onSuccess());*/
        }
    }

    open(id, event) {
        const openInNewTab = (event.ctrlKey || event.metaKey || event.which === 2);
        if (openInNewTab) {
            /*$window.open($state.href('app.stack', { id: id }, { absolute: true }), '_blank');*/
        } else {
            /*$state.go('app.stack', { id: id });*/
        }

        event.preventDefault();
    }
}