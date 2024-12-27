


function changed {
    git diff --name-only HEAD@{2} HEAD | grep "^$1" > /dev/null 2>&1
}


# update npm package if package.lock changed
if changed 'app/config/parameters.yml.dist' || changed 'composer.lock'; then
    echo -ne '\n\e[31mWARNING:\e[m \e[33mThe composer.lock and/or the parameters.yml.dist file changed, composer install needs to be executed.\e[m\n\n'
    composer install # or even better: make composer-install
fi

if changed 'app/DoctrineMigrations'; then
    echo -ne '\n\e[31mWARNING:\e[m \e[33mThere are new migrations to be executed.\e[m\n\n'
    bin/console doctrine:migrations:migrate -n # or even better: make doctrine-migrate
fi
