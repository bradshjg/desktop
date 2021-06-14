import { getTopLevelWorkingDirectory } from '../../git'

/**
 * Get the path to the parent of the .git directory or null if the path isn't a
 * valid repository.
 */
export async function validatedRepositoryPath(
  path: string
): Promise<string | null> {
  try {
    const virtual = new URL(path)
    if (virtual.protocol === 'virtual:') { return path }
  } catch (e) {}

  try {
    return await getTopLevelWorkingDirectory(path)
  } catch (e) {

    return null
  }
}
