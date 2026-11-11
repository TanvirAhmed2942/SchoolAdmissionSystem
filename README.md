# 

# 

# \## Running the Application with Docker

# 

# \### Prerequisites

# 

# \- Docker Desktop installed and running.

# \- Git installed.

# 

# \### 1. Clone the Repository

# 

# ```bash

# git clone YOUR\_REPOSITORY\_URL

# cd YOUR\_PROJECT\_DIRECTORY

# ```

# 

# \### 2. Start the Application

# 

# Run Docker Compose:

# 

# ```bash

# docker compose up --build -d

# ```

# 

# This starts the application's services:

# 

# \- Frontend (React): `http://localhost:5171`

# \- ASP.NET Core Web API: `http://localhost:8080`

# \- PostgreSQL Database: `localhost:5432`

# 

# \### 3. Check Running Containers

# 

# ```bash

# docker compose ps

# ```

# 

# \### 4. View Application Logs

# 

# ```bash

# docker compose logs -f

# ```

# 

# \### 5. Stop the Application

# 

# ```bash

# docker compose down

# ```

# 

# To stop the application and remove the database volume:

# 

# ```bash

# docker compose down -v

# ```

# 

# \*\*Warning:\*\* The `-v` option deletes persisted database data.

# 

# \---

# 

# \## Running Integration Tests

# 

# \### Prerequisites

# 

# \- .NET 10 SDK

# \- Docker Desktop installed and running.

# 

# The integration tests use xUnit, WebApplicationFactory, Testcontainers, and PostgreSQL.

# 

# Navigate to the backend solution directory:

# 

# ```bash

# cd Backend/SchoolAdmissionSystem

# ```

# 

# Run the tests:

# 

# ```bash

# dotnet test

# ```

# 

# Testcontainers automatically creates an isolated temporary PostgreSQL container for testing. The tests apply EF Core migrations and clean up the container after execution.

# 

# \### Concurrency Test

# 

# The test `OnlyOneStudent\_ShouldGetTheLastAvailableSeat` verifies:

# 

# \- 10 students send simultaneous admission hold requests.

# \- Only one student successfully reserves the last available seat.

# \- The other nine requests receive `409 Conflict`.

# \- PostgreSQL contains exactly one active admission hold.

# 

# \*\*Expected result:\*\*

# 

# | Result | Expected |

# |---|---:|

# | Total requests | 10 |

# | Successful (`200 OK`) | 1 |

# | Rejected (`409 Conflict`) | 9 |

# | Active holds | 1 |

# 

# This verifies PostgreSQL row-level locking using `SELECT ... FOR UPDATE` to prevent overbooking.

# 

# 

