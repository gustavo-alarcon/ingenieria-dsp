export interface UIConfig {
    spareParts: {
        menu: boolean;
        // Mejoras
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
        }
        // Reemplazos
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
        }
        // Frecuencia
        frequency:
        {
            menu: boolean;
        }
        // Resumen
        summary: {
            menu: boolean;
            toolbar: {
                download: boolean;
            }
            actions: {
                delete: boolean;
            }
        }
        // Revisión de repuestos
        sparesCheck: {
            menu: boolean;
            toolbar: {
                attachSis: boolean;
            }
            actions: {
                download: boolean;
            }
        }
        // Configuración
        configuration: {
            menu: boolean;
            toolbar: {
                upload: boolean;
            }
            actions: {
                save: boolean;
            }
        }
    };

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
                }
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
                }
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
                }
            };
            configurations: {
                panel: {
                    notifications: boolean;
                    lists: boolean;
                    broadcast: boolean;
                };
            }
        }
    };

    budgets: {
        menu: boolean;
        // Entrada diaria
        dailyEntry: {
            menu: boolean;
            toolbar: {
                upload: boolean;
            }
            actions: {
                edit: boolean;
                delete: boolean;
            }
        }
        // Presupuestos
        budgets: {
            menu: boolean;
            tabs: {
                summary: boolean;
                sendPending: boolean;
                approvalPending: boolean;
            }
        }
        // Configuración
        configuration: {
            menu: boolean;
            panel: {
                lists: boolean;
                broadcast: boolean;
            }
        }
    };
}