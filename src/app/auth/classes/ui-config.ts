export class UiConfig {
    spareParts: {
        menu: boolean;
        improvements: {
            menu: boolean;
            toolbar: {
                create: boolean;
            }
            actions: {
                validate: boolean;
                replace: boolean;
                edit: boolean;
                delete: boolean;
            }
        };
        replacements: {
            menu: boolean;
            toolbar: {
                create: boolean;
                bulk: boolean;
            }
            actions: {
                edit: boolean;
                delete: boolean;
            }
        };
        frequency:
        {
            menu: boolean;
        };
        summary: {
            menu: boolean;
            toolbar: {
                download: boolean;
            }
            actions: {
                delete: boolean;
            }
        };
        sparesCheck: {
            menu: boolean;
            toolbar: {
                attachSis: boolean;
            }
            actions: {
                download: boolean;
            }
        };
        configuration: {
            menu: boolean;
            toolbar: {
                upload: boolean;
            }
            actions: {
                save: boolean;
            }
        };
    }

    preEvaluations: {
        menu: boolean;
        tabs: {
            requests: {
                toolbar: {
                    create: boolean;
                    configuration: boolean;
                };
                actions: {
                    init: boolean;
                    observations: boolean;
                    timeLine: boolean;
                };
            };
            process: {
                toolbar: {
                    configuration: boolean;
                };
                actions: {
                    finalize: boolean;
                    setPending: boolean;
                    images: boolean;
                    timeLine: boolean;
                    observations: boolean;
                    inquiries: boolean;
                };
            };
            results: {
                toolbar: {
                    bulk: boolean;
                    download: boolean;
                    report: boolean;
                };
                actions: {
                    edit: boolean;
                    delete: boolean;
                    timeLine: boolean;
                    observations: boolean;
                    images: boolean;
                };
            };
            configurations: {
                panel: {
                    notifications: boolean;
                    lists: boolean;
                    broadcast: boolean;
                };
            };
        };
    };

    budgets: {
        menu: boolean;
        dailyEntry: {
            menu: boolean;
            toolbar: {
                upload: boolean;
            };
            actions: {
                edit: boolean;
                delete: boolean;
            };
        };
        budgets: {
            menu: boolean;
            tabs: {
                summary: boolean;
                sendPending: boolean;
                approvalPending: boolean;
            };
        };
        configuration: {
            menu: boolean;
            panel: {
                lists: boolean;
                broadcast: boolean;
            };
        };
    };

    andon: {
        menu: boolean;
        report: {
            menu: boolean;
        };
        dashboard: {
            menu: boolean;
        };
        history: {
            menu: boolean;
            toolbar: {
                download: boolean;
            };
            actions: {
                images: boolean;
            };
        };
        configuration: {
            menu: boolean;
        }
    };

    quality: {
        menu: boolean;
        internalEvents: {
            menu: boolean;
            forms: {
                workshop: boolean;
                component: boolean;
            }
        }
        externalEvents: {
            menu: boolean;
            forms: {
                component: boolean;
                miningOperation: boolean;
            }
        }
        analysis: {
            menu: boolean;
            tabs: {
                registers: {
                    toolbar: {
                        configuration: boolean;
                    };
                    actions: {
                        details: boolean;
                        assignEspecialist: boolean;
                        timeLine: boolean;
                    };
                };
                process: {
                    toolbar: {
                        configuration: boolean;
                    };
                    actions: {
                        details: boolean;
                        analysis: boolean;
                        report: boolean;
                        timeLine: boolean;
                    };
                    forms: {
                        failRoot: boolean;
                        process: boolean;
                    }
                };
                tracing: {
                    toolbar: {
                        configuration: boolean;
                    };
                    actions: {
                        details: boolean;
                        correctiveActions: boolean;
                        report: boolean;
                        timeLine: boolean;
                    };
                };
                results: {
                    toolbar: {
                        download: boolean;
                    };
                    actions: {
                        edit: boolean;
                        delete: boolean;
                        timeLine: boolean;
                        details: boolean;
                        report: boolean;
                        correctiveActions: boolean;
                    };
                };
            };
        };
        configurations: {
            panel: {
                lists: boolean;
                broadcast: boolean;
            };
        };
    };

    evaluations: {
        menu: boolean;
        templates: boolean;
        technicalSupport: boolean;
        results: boolean;
        reports: boolean;
        configurations: boolean;
    }

    constructor(role) {
        // set default values
        this.init();

        switch (role) {
            case 'superuser':
                this.setSuperuserUI();
                break;

            case 'administrator':
                this.setAdministratorUI();
                break;

            case 'technician':
                this.setTechnicianUI();
                break;

            default:
                this.init();
                break;
        }
    }

    /**
     * Set the configuration objects as false
     *
     * @private
     * @memberof UiConfig
     */
    private init(): void {
        this.spareParts = {
            menu: false,
            improvements: {
                menu: false,
                toolbar: {
                    create: false
                },
                actions: {
                    validate: false,
                    replace: false,
                    edit: false,
                    delete: false
                }
            },
            replacements: {
                menu: false,
                toolbar: {
                    create: false,
                    bulk: false
                },
                actions: {
                    edit: false,
                    delete: false
                }
            },
            frequency:
            {
                menu: false
            },
            summary: {
                menu: false,
                toolbar: {
                    download: false
                },
                actions: {
                    delete: false
                }
            },
            sparesCheck: {
                menu: false,
                toolbar: {
                    attachSis: false
                },
                actions: {
                    download: false
                }
            },
            configuration: {
                menu: false,
                toolbar: {
                    upload: false
                },
                actions: {
                    save: false
                }
            }
        }

        this.preEvaluations = {
            menu: false,
            tabs: {
                requests: {
                    toolbar: {
                        create: false,
                        configuration: false,
                    },
                    actions: {
                        init: false,
                        observations: false,
                        timeLine: false,
                    }
                },
                process: {
                    toolbar: {
                        configuration: false
                    },
                    actions: {
                        finalize: false,
                        setPending: false,
                        images: false,
                        timeLine: false,
                        observations: false,
                        inquiries: false
                    }
                },
                results: {
                    toolbar: {
                        bulk: false,
                        download: false,
                        report: false
                    },
                    actions: {
                        edit: false,
                        delete: false,
                        timeLine: false,
                        observations: false,
                        images: false
                    }
                },
                configurations: {
                    panel: {
                        notifications: false,
                        lists: false,
                        broadcast: false
                    }
                }
            }
        }

        this.budgets = {
            menu: false,
            dailyEntry: {
                menu: false,
                toolbar: {
                    upload: false
                },
                actions: {
                    edit: false,
                    delete: false
                }
            },
            budgets: {
                menu: false,
                tabs: {
                    summary: false,
                    sendPending: false,
                    approvalPending: false
                }
            },
            configuration: {
                menu: false,
                panel: {
                    lists: false,
                    broadcast: false
                }
            }
        }

        this.andon = {
            menu: false,
            report: {
                menu: false
            },
            dashboard: {
                menu: false
            },
            history: {
                menu: false,
                toolbar: {
                    download: false
                },
                actions: {
                    images: false
                }
            },
            configuration: {
                menu: false
            }
        }

        this.quality = {
            menu: false,
            internalEvents: {
                menu: false,
                forms: {
                    workshop: false,
                    component: false
                }
            },
            externalEvents: {
                menu: false,
                forms: {
                    component: false,
                    miningOperation: false
                }
            },
            analysis: {
                menu: false,
                tabs: {
                    registers: {
                        toolbar: {
                            configuration: false
                        },
                        actions: {
                            details: false,
                            assignEspecialist: false,
                            timeLine: false
                        }
                    },
                    process: {
                        toolbar: {
                            configuration: false
                        },
                        actions: {
                            details: false,
                            analysis: false,
                            report: false,
                            timeLine: false
                        },
                        forms: {
                            failRoot: false,
                            process: false
                        }
                    },
                    tracing: {
                        toolbar: {
                            configuration: false
                        },
                        actions: {
                            details: false,
                            correctiveActions: false,
                            report: false,
                            timeLine: false
                        }
                    },
                    results: {
                        toolbar: {
                            download: false
                        },
                        actions: {
                            edit: false,
                            delete: false,
                            timeLine: false,
                            details: false,
                            report: false,
                            correctiveActions: false
                        }
                    }
                }
            },
            configurations: {
                panel: {
                    lists: false,
                    broadcast: false
                }
            }
        }

        this.evaluations = {
            menu: false,
            templates: false,
            technicalSupport: false,
            results: false,
            reports: false,
            configurations: false
        }
    }

    /**
     * Set the configuration objects as true for super users
     *
     * @private
     * @memberof UiConfig
     */
    private setSuperuserUI(): void {
        this.spareParts = {
            menu: true,
            improvements: {
                menu: true,
                toolbar: {
                    create: true
                },
                actions: {
                    validate: true,
                    replace: true,
                    edit: true,
                    delete: true
                }
            },
            replacements: {
                menu: true,
                toolbar: {
                    create: true,
                    bulk: true
                },
                actions: {
                    edit: true,
                    delete: true
                }
            },
            frequency:
            {
                menu: true
            },
            summary: {
                menu: true,
                toolbar: {
                    download: true
                },
                actions: {
                    delete: true
                }
            },
            sparesCheck: {
                menu: true,
                toolbar: {
                    attachSis: true
                },
                actions: {
                    download: true
                }
            },
            configuration: {
                menu: true,
                toolbar: {
                    upload: true
                },
                actions: {
                    save: true
                }
            }
        }

        this.preEvaluations = {
            menu: true,
            tabs: {
                requests: {
                    toolbar: {
                        create: true,
                        configuration: true,
                    },
                    actions: {
                        init: true,
                        observations: true,
                        timeLine: true,
                    }
                },
                process: {
                    toolbar: {
                        configuration: true
                    },
                    actions: {
                        finalize: true,
                        setPending: true,
                        images: true,
                        timeLine: true,
                        observations: true,
                        inquiries: true
                    }
                },
                results: {
                    toolbar: {
                        bulk: true,
                        download: true,
                        report: true
                    },
                    actions: {
                        edit: true,
                        delete: true,
                        timeLine: true,
                        observations: true,
                        images: true
                    }
                },
                configurations: {
                    panel: {
                        notifications: true,
                        lists: true,
                        broadcast: true
                    }
                }
            }
        }

        this.budgets = {
            menu: true,
            dailyEntry: {
                menu: true,
                toolbar: {
                    upload: true
                },
                actions: {
                    edit: true,
                    delete: true
                }
            },
            budgets: {
                menu: true,
                tabs: {
                    summary: true,
                    sendPending: true,
                    approvalPending: true
                }
            },
            configuration: {
                menu: true,
                panel: {
                    lists: true,
                    broadcast: true
                }
            }
        }

        this.andon = {
            menu: true,
            report: {
                menu: true
            },
            dashboard: {
                menu: true
            },
            history: {
                menu: true,
                toolbar: {
                    download: true
                },
                actions: {
                    images: true
                }
            },
            configuration: {
                menu: true
            }
        }

        this.quality = {
            menu: true,
            internalEvents: {
                menu: true,
                forms: {
                    workshop: true,
                    component: true
                }
            },
            externalEvents: {
                menu: true,
                forms: {
                    component: true,
                    miningOperation: true
                }
            },
            analysis: {
                menu: true,
                tabs: {
                    registers: {
                        toolbar: {
                            configuration: true
                        },
                        actions: {
                            details: true,
                            assignEspecialist: true,
                            timeLine: true
                        }
                    },
                    process: {
                        toolbar: {
                            configuration: true
                        },
                        actions: {
                            details: true,
                            analysis: true,
                            report: true,
                            timeLine: true
                        },
                        forms: {
                            failRoot: true,
                            process: true
                        }
                    },
                    tracing: {
                        toolbar: {
                            configuration: true
                        },
                        actions: {
                            details: true,
                            correctiveActions: true,
                            report: true,
                            timeLine: true
                        }
                    },
                    results: {
                        toolbar: {
                            download: true
                        },
                        actions: {
                            edit: true,
                            delete: true,
                            timeLine: true,
                            details: true,
                            report: true,
                            correctiveActions: true
                        }
                    }
                }
            },
            configurations: {
                panel: {
                    lists: true,
                    broadcast: true
                }
            }
        }

        this.evaluations = {
            menu: true,
            templates: true,
            technicalSupport: true,
            results: true,
            reports: true,
            configurations: true
        }
    }

    /**
     * Set UI configuration for administrators
     *
     * @private
     * @memberof UiConfig
     */
    private setAdministratorUI(): void {
        // spare parts
        this.spareParts.menu = true;
        this.spareParts.sparesCheck.menu = true;
        this.spareParts.sparesCheck.toolbar.attachSis = true;
        this.spareParts.sparesCheck.actions.download = true;
        // pre-evaluations
        this.preEvaluations.menu = true;
        this.preEvaluations.tabs.requests.toolbar.create = true;
        this.preEvaluations.tabs.requests.actions.init = true;
        this.preEvaluations.tabs.requests.actions.observations = true;
        this.preEvaluations.tabs.requests.actions.timeLine = true;
        this.preEvaluations.tabs.process.actions.finalize = true;
        this.preEvaluations.tabs.process.actions.images = true;
        this.preEvaluations.tabs.process.actions.inquiries = true;
        this.preEvaluations.tabs.process.actions.observations = true;
        this.preEvaluations.tabs.process.actions.setPending = true;
        this.preEvaluations.tabs.process.actions.timeLine = true;
        this.preEvaluations.tabs.results.actions.observations = true;
        this.preEvaluations.tabs.results.actions.images = true;
        this.preEvaluations.tabs.results.actions.timeLine = true;
        // presupuestos
        this.budgets.dailyEntry.menu = true;
        this.budgets.budgets.menu = true;
        // andon
        this.andon.report.menu = true;
        this.andon.dashboard.menu = true;
        this.andon.history.menu = true;
        // quality
        this.quality.internalEvents.menu = true;
        this.quality.internalEvents.forms.component = true;
        this.quality.internalEvents.forms.workshop = true;
        this.quality.externalEvents.menu = true;
        this.quality.externalEvents.forms.component = true;
        this.quality.externalEvents.forms.miningOperation = true;
        this.quality.analysis.menu = true;
        this.quality.analysis.tabs.registers.actions.details = true;
        this.quality.analysis.tabs.registers.actions.timeLine = true;
        this.quality.analysis.tabs.process.actions.details = true;
        this.quality.analysis.tabs.process.actions.timeLine = true;
        this.quality.analysis.tabs.tracing.actions.details = true;
        this.quality.analysis.tabs.tracing.actions.correctiveActions = true;
        this.quality.analysis.tabs.tracing.actions.timeLine = true;
        this.quality.analysis.tabs.results.actions.edit = true;
        this.quality.analysis.tabs.results.actions.details = true;
        this.quality.analysis.tabs.results.actions.timeLine = true;
        // evaluations
        this.evaluations.menu = true;
        this.evaluations.templates = true;
        this.evaluations.technicalSupport = true;
        this.evaluations.results = true;
        this.evaluations.reports = true;
    }

    /**
     * Set UI configuration for technicians
     *
     * @private
     * @memberof UiConfig
     */
    private setTechnicianUI(): void {
        // spare parts
        this.spareParts.menu = true;
        this.spareParts.sparesCheck.menu = true;
        this.spareParts.sparesCheck.toolbar.attachSis = true;
        this.spareParts.sparesCheck.actions.download = true;
        // pre-evaluations
        this.preEvaluations.menu = true;
        this.preEvaluations.tabs.requests.toolbar.create = true;
        this.preEvaluations.tabs.requests.actions.init = true;
        this.preEvaluations.tabs.requests.actions.observations = true;
        this.preEvaluations.tabs.requests.actions.timeLine = true;
        this.preEvaluations.tabs.process.actions.finalize = true;
        this.preEvaluations.tabs.process.actions.images = true;
        this.preEvaluations.tabs.process.actions.inquiries = true;
        this.preEvaluations.tabs.process.actions.observations = true;
        this.preEvaluations.tabs.process.actions.setPending = true;
        this.preEvaluations.tabs.process.actions.timeLine = true;
        this.preEvaluations.tabs.results.actions.observations = true;
        this.preEvaluations.tabs.results.actions.images = true;
        this.preEvaluations.tabs.results.actions.timeLine = true;
        // presupuestos
        this.budgets.dailyEntry.menu = true;
        this.budgets.budgets.menu = true;
        // andon
        this.andon.report.menu = true;
        this.andon.dashboard.menu = true;
        this.andon.history.menu = true;
        // quality
        this.quality.internalEvents.menu = true;
        this.quality.externalEvents.menu = true;
        this.quality.analysis.menu = true;
        this.quality.analysis.tabs.registers.actions.details = true;
        this.quality.analysis.tabs.registers.actions.timeLine = true;
        this.quality.analysis.tabs.process.actions.details = true;
        this.quality.analysis.tabs.process.actions.timeLine = true;
        this.quality.analysis.tabs.tracing.actions.details = true;
        this.quality.analysis.tabs.tracing.actions.correctiveActions = true;
        this.quality.analysis.tabs.tracing.actions.timeLine = true;
        this.quality.analysis.tabs.results.actions.edit = true;
        this.quality.analysis.tabs.results.actions.details = true;
        this.quality.analysis.tabs.results.actions.timeLine = true;
        // evaluations
        this.evaluations.menu = true;
        this.evaluations.templates = true;
        this.evaluations.technicalSupport = true;
        this.evaluations.results = true;
        this.evaluations.reports = true;
    }

}
