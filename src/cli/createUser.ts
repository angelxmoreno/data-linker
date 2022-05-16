import '@utils/env';
import inquirer from 'inquirer';
import { UserEntity, UserRole } from '@database/entities/UserEntity';
import { AppDataSource } from '@database/data-source';
import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';

(async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        clear();
        console.log(chalk.yellow(figlet.textSync('Create User', { horizontalLayout: 'full' })));
        const { name, role } = await inquirer.prompt<{ name: string; role: UserRole }>([
            {
                name: 'name',
                type: 'input',
                message: 'Enter the name for the user',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a name';
                    }
                },
            },
            {
                name: 'role',
                type: 'list',
                message: 'user role',
                choices: [UserRole.CONSUMER, UserRole.PUBLISHER],
            },
        ]);

        const user = UserEntity.build<UserEntity>({
            name,
            role,
        });
        await user.save();
        console.log({ user });
        process.exit(0);
    } catch (error) {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }

        console.error(error);
    }
})();
