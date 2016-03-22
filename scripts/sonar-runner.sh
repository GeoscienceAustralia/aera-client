#!/usr/bin/env bash
cd /tmp/
wget http://repo1.maven.org/maven2/org/codehaus/sonar/runner/sonar-runner-dist/2.4/sonar-runner-dist-2.4.zip
mkdir /opt/sonar-runner
unzip sonar-runner-dist-2.4.zip -d /opt/sonar-runner
rm -f /tmp/sonar-runner-dist-2.4.zip
export SONAR_RUNNER_HOME="/opt/sonar-runner/sonar-runner-2.4"
PATH=$PATH:$SONAR_RUNNER_HOME/bin
