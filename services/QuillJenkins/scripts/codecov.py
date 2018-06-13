"""Helpers for the Jenkins Pipeline"""
import requests


def current_no(branch):
    """Get the code coverage report for a given folder and branch"""
    URL = "https://codecov.io/api/gh/empirical-org/Empirical-Core/branch/{}"
    r = requests.get(
        URL.format(branch)
    )
    result = float(r.json()['commit']['totals'].get('c', '0.0'))
    print(result)
    return result

def fail_on_decrease(old_b, new_b):
    if (current_no(old_b) > current_no(new_b)):
        raise Exception('CoverageDecreaseError')



