class BaseCommand {
    client;
    opts;
    command;

    constructor(client, command, opts = {
        enabled: true,
        dm_permission: false,
    }) {
        this.client = client;
        this.command = command;
        this.opts = opts;
    }

    get name() {
        return this.command.name;
    }

    get description() {
        return this.command.description;
    }

    get options() {
        return this.command.options;
    }

    autocomplete(interaction) {
        return interaction.respond([]);
    }

    toApplicationCommand() {
        return {
            ...this.command,
            dm_permission: this.opts.dm_permission ?? false,
        };
    }
}

export default BaseCommand;