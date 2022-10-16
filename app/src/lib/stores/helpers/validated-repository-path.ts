
import { getTopLevelWorkingDirectory } from '../../git'

/**
 * Get the path to the parent of the .git directory or null if the path isn't a
 * valid repository.
 */
export async function validatedRepositoryPath(
  path: string
): Promise<string | null> {
  if (path.startsWith('ssh::')) {
    return path
  }

  try {
    return await getTopLevelWorkingDirectory(path)
  } catch (e) {

    return null
  }
}
